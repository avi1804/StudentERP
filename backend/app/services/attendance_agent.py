import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import re
import json
import base64
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import date, datetime
from io import BytesIO

from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
try:
    import pypdf
except ImportError:
    pypdf = None

from app.core.config import settings
from app.models.student import Student
from app.models.user import User, Role
from app.models.subject import Subject
from app.models.subject_assignment import SubjectAssignment
from app.models.timetable import Timetable
from app.models.attendance import Attendance, AttendanceStatus
from app.models.ai_attendance import (
    AIAttendanceSession,
    AIAttendanceMatch,
    AIAttendanceSessionStatus,
    AIAttendanceMatchStatus
)

logger = logging.getLogger(__name__)

# Configurable confidence thresholds
AUTO_MATCH_CONFIDENCE = 0.90
REVIEW_REQUIRED_CONFIDENCE = 0.70

# Allowed file types and max size (10 MB)
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "txt"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024


class AttendanceAgentService:
    """Production-grade AI Attendance Agent for document extraction and student matching."""

    @staticmethod
    def validate_upload_file(filename: str, file_bytes: bytes, content_type: Optional[str] = None) -> str:
        """Validate uploaded file extension, size, and return normalized type."""
        if not filename or "." not in filename:
            raise ValueError("Uploaded file must have a valid file extension.")

        ext = filename.rsplit(".", 1)[-1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported file format '.{ext}'. Supported formats: PDF, PNG, JPG, JPEG, TXT.")

        if len(file_bytes) == 0:
            raise ValueError("The uploaded file is empty.")

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise ValueError("File exceeds maximum allowed size of 10 MB.")

        if ext == "pdf":
            return "pdf"
        elif ext in ["png", "jpg", "jpeg"]:
            return "image"
        elif ext == "txt":
            return "text"
        return "text"

    @classmethod
    async def extract_text_from_file(cls, file_bytes: bytes, filename: str, file_type: str) -> str:
        """Extract textual content from PDF, Image, or Text file."""
        if file_type == "text":
            try:
                return file_bytes.decode("utf-8")
            except UnicodeDecodeError:
                return file_bytes.decode("latin-1", errors="ignore")

        elif file_type == "pdf":
            text_pages = []
            try:
                reader = pypdf.PdfReader(BytesIO(file_bytes))
                for page_idx, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    if page_text.strip():
                        text_pages.append(page_text.strip())
            except Exception as e:
                logger.warning(f"pypdf extraction failed or partial for {filename}: {e}")

            combined_text = "\n".join(text_pages).strip()
            # If text was extracted from PDF, return it
            if len(combined_text) >= 10:
                return combined_text

            # If PDF has no extractable text (e.g. scanned PDF), try vision extraction on first page image if available
            try:
                reader = pypdf.PdfReader(BytesIO(file_bytes))
                for page in reader.pages:
                    for img_obj in page.images:
                        img_bytes = img_obj.data
                        img_text = await cls._extract_text_from_image_vision(img_bytes)
                        if img_text.strip():
                            return img_text
            except Exception as e:
                logger.warning(f"PDF image extraction fallback failed: {e}")

            return combined_text or "No readable text found in PDF document."

        elif file_type == "image":
            return await cls._extract_text_from_image_vision(file_bytes)

        return ""

    @classmethod
    async def _extract_text_from_image_vision(cls, image_bytes: bytes) -> str:
        """Extract text from image using AI Vision (Puter AI gpt-4o-mini)."""
        token = settings.PUTER_AUTH_TOKEN
        if not token:
            logger.warning("PUTER_AUTH_TOKEN not configured for vision extraction.")
            return ""

        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        url = "https://api.puter.com/drivers/call"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        prompt = (
            "You are an academic OCR and attendance extractor. Read this attendance document or sheet image very carefully.\n"
            "Extract and transcribe all student enrollment numbers, roll numbers, and student names visible.\n"
            "Output each student on a new line with enrollment number clearly stated (e.g. '24CSE001 - Rahul Patel' or '24CSE001').\n"
            "If enrollment numbers are in a table or column, list all of them. Do not omit any numbers."
        )

        payload = {
            "interface": "puter-chat-completion",
            "driver": "ai-chat",
            "test_mode": False,
            "method": "complete",
            "args": {
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_image}"}}
                        ]
                    }
                ],
                "model": "gpt-4o-mini",
                "temperature": 0.1
            },
            "auth_token": token
        }

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    content = data.get("result", {}).get("message", {}).get("content", "")
                    return content.strip()
                else:
                    logger.error(f"Puter Vision API error {res.status_code}: {res.text}")
                    return ""
        except Exception as e:
            logger.error(f"Failed to perform vision extraction with Puter AI: {e}")
            return ""

    @classmethod
    def extract_enrollment_tokens(cls, text: str) -> List[Dict[str, str]]:
        """
        Extract candidate enrollment tokens using robust multi-pattern regex.
        Returns a list of dicts: [{"raw": token, "source_line": line_snippet}].
        """
        if not text:
            return []

        tokens: List[Dict[str, str]] = []
        seen = set()

        lines = text.splitlines()

        stop_words = {"STUDENT", "STUDENTS", "STUDY", "ATTENDANCE", "SUBJECT", "SEMESTER", "PRESENT", "ABSENT", "FACULTY", "ACADEMIC"}

        # Regex patterns covering Indian university and ERP enrollment styles:
        patterns = [
            # 24CSE001, 23IT042, 21EC005
            re.compile(r"\b([0-9]{2}[A-Za-z]{2,6}[0-9]{2,6})\b"),
            # STU-0001, STU-2025-09, STU25002
            re.compile(r"\b(STU[-_]?[0-9A-Za-z]+(?:[-_][0-9A-Za-z]+)*)\b", re.IGNORECASE),
            # CS629, EC102, ME301
            re.compile(r"\b([A-Za-z]{2,4}[-_]?[0-9]{3,5})\b"),
            # ENR0001, ENR2024001, ENR-001
            re.compile(r"\b(ENR[-_]?[0-9A-Za-z]{3,10})\b", re.IGNORECASE),
            # General alphanumeric tokens: e.g. 24BCSE101
            re.compile(r"\b([0-9]{2,4}[A-Za-z]+[0-9]{2,6})\b"),
        ]

        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                continue

            for pattern in patterns:
                for match in pattern.finditer(trimmed):
                    token = match.group(1).strip()
                    token_upper = token.upper()
                    # Ensure token has at least 1 digit and is not a stop word
                    if (
                        token_upper not in seen 
                        and len(token_upper) >= 4 
                        and token_upper not in stop_words
                        and any(ch.isdigit() for ch in token_upper)
                    ):
                        seen.add(token_upper)
                        tokens.append({
                            "raw": token,
                            "source_line": trimmed[:120]
                        })

        return tokens

    @classmethod
    async def extract_enrollments_with_ai_fallback(cls, text: str, initial_tokens: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        If regex found few or no tokens, or for dense unstructured text,
        use Puter AI to identify and return all student enrollment numbers.
        """
        # If we already found 3 or more tokens, regex succeeded; return as is
        if len(initial_tokens) >= 3 or not settings.PUTER_AUTH_TOKEN or len(text.strip()) < 10:
            return initial_tokens

        url = "https://api.puter.com/drivers/call"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.PUTER_AUTH_TOKEN}"
        }

        prompt = (
            "Analyze the following attendance text and extract all student enrollment numbers or roll numbers.\n"
            "Format the output strictly as a JSON list of strings, for example: [\"24CSE001\", \"24CSE002\", \"STU25002\"]\n"
            "Do NOT include markdown formatting or explanations, output only raw JSON.\n\n"
            f"TEXT:\n{text[:4000]}"
        )

        payload = {
            "interface": "puter-chat-completion",
            "driver": "ai-chat",
            "test_mode": False,
            "method": "complete",
            "args": {
                "messages": [{"role": "user", "content": prompt}],
                "model": "gpt-5.4-nano",
                "temperature": 0.0
            },
            "auth_token": settings.PUTER_AUTH_TOKEN
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    raw_content = res.json().get("result", {}).get("message", {}).get("content", "").strip()
                    # Strip any ```json code blocks
                    raw_content = re.sub(r"^```(?:json)?\s*", "", raw_content)
                    raw_content = re.sub(r"\s*```$", "", raw_content)
                    extracted = json.loads(raw_content)
                    if isinstance(extracted, list):
                        existing_keys = {t["raw"].upper() for t in initial_tokens}
                        for item in extracted:
                            str_item = str(item).strip()
                            if str_item.upper() not in existing_keys and len(str_item) >= 3:
                                existing_keys.add(str_item.upper())
                                initial_tokens.append({
                                    "raw": str_item,
                                    "source_line": f"AI Extracted: {str_item}"
                                })
        except Exception as e:
            logger.warning(f"AI enrollment extraction fallback error: {e}")

        return initial_tokens

    @staticmethod
    def normalize_ocr_enrollment(raw: str) -> str:
        """
        Normalize enrollment string and resolve common OCR misreadings:
        - 'O' or 'o' in numeric segments -> '0'
        - 'I', 'l', '|' in numeric segments -> '1'
        - 'S' or 's' in numeric segments -> '5'
        - 'Z' or 'z' in numeric segments -> '2'
        - 'B' in numeric segments -> '8'
        """
        cleaned = re.sub(r"[\s\-_]", "", raw).upper()

        # If format is prefix (alpha) + digits (e.g. 24CSE00I -> 24CSE001)
        # Match pattern: digits (year), letters (dept), alphanumeric suffix (roll)
        m = re.match(r"^(\d{2}[A-Z]{2,5})([A-Z0-9]+)$", cleaned)
        if m:
            prefix, suffix = m.group(1), m.group(2)
            # Normalize suffix where letters were OCR-mistaken for digits
            substitutions = {
                "O": "0", "I": "1", "L": "1", "S": "5", "Z": "2", "B": "8", "G": "6"
            }
            norm_suffix = "".join(substitutions.get(ch, ch) for ch in suffix)
            return f"{prefix}{norm_suffix}"

        # Match STU prefix: STU + letters/digits (e.g. STU25OO2 -> STU25002)
        m_stu = re.match(r"^(STU)(\d*)([A-Z0-9]*)$", cleaned)
        if m_stu:
            prefix = m_stu.group(1)
            rest = cleaned[3:]
            substitutions = {"O": "0", "I": "1", "L": "1", "S": "5"}
            norm_rest = "".join(substitutions.get(ch, ch) for ch in rest)
            return f"{prefix}{norm_rest}"

        return cleaned

    @classmethod
    def calculate_levenshtein_ratio(cls, s1: str, s2: str) -> float:
        """Fast normalized similarity ratio between two enrollment strings."""
        s1, s2 = s1.upper(), s2.upper()
        if s1 == s2:
            return 1.0
        len1, len2 = len(s1), len(s2)
        if len1 == 0 or len2 == 0:
            return 0.0

        # Matrix dynamic programming
        dp = [[0] * (len2 + 1) for _ in range(len1 + 1)]
        for i in range(len1 + 1):
            dp[i][0] = i
        for j in range(len2 + 1):
            dp[0][j] = j

        for i in range(1, len1 + 1):
            for j in range(1, len2 + 1):
                cost = 0 if s1[i - 1] == s2[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,      # deletion
                    dp[i][j - 1] + 1,      # insertion
                    dp[i - 1][j - 1] + cost # substitution
                )

        distance = dp[len1][len2]
        max_len = max(len1, len2)
        return max(0.0, 1.0 - (distance / max_len))

    @staticmethod
    def _differs_only_in_trailing_digits(s1: str, s2: str) -> bool:
        """
        Returns True if s1 and s2 share an identical alpha prefix and differ
        only in the trailing numeric sequence.  e.g. STU25002 vs STU25003,
        24CSE001 vs 24CSE002.  These are DISTINCT students, never typos.
        """
        # Find the split point where trailing digits begin
        def split_prefix_digits(s: str):
            i = len(s)
            while i > 0 and s[i - 1].isdigit():
                i -= 1
            return s[:i], s[i:]

        p1, d1 = split_prefix_digits(s1)
        p2, d2 = split_prefix_digits(s2)

        # Same prefix, both have trailing digits, but digits differ
        if p1 == p2 and d1 and d2 and d1 != d2:
            return True
        return False

    @classmethod
    def match_tokens_against_database(
        cls,
        tokens: List[Dict[str, str]],
        subject_students: List[Student],
        all_students: List[Student],
        student_user_map: Dict[int, User]
    ) -> List[Dict[str, Any]]:
        """
        Matches extracted tokens against the ENTIRE university student roster.

        Priority order (critical for 100% accuracy):
          1. Exact match (raw or cleaned) against ALL students -> AUTO_MATCHED (0.99)
          2. OCR-normalized exact match against ALL students   -> AUTO_MATCHED (0.95)
          3. Controlled fuzzy match (only if NOT a sequential-digit difference) -> REVIEW_REQUIRED
          4. Unmatched -> NOT_FOUND

        The old code searched subject_students first and did fuzzy matching
        against that tiny pool BEFORE checking all_students for an exact match.
        That caused STU25003 to fuzzy-match STU25002 (87% similar) instead of
        being recognized as its own exact entry in the full database.
        """
        results: List[Dict[str, Any]] = []

        # Build lookup map: cleaned enrollment -> Student for ALL students
        all_map_exact: Dict[str, Student] = {}
        for s in all_students:
            enr_clean = re.sub(r"[\s\-_]", "", s.enrollment_number).upper()
            all_map_exact[enr_clean] = s

        matched_student_ids = set()

        for item in tokens:
            raw = item["raw"]
            source = item["source_line"]
            raw_clean = re.sub(r"[\s\-_]", "", raw).upper()
            normalized = cls.normalize_ocr_enrollment(raw)

            # ── PRIORITY 1: Exact match against ALL students ──
            exact_stu = all_map_exact.get(raw_clean)
            if exact_stu:
                user_obj = student_user_map.get(exact_stu.user_id)
                results.append({
                    "enrollment_number": raw,
                    "normalized_enrollment": raw_clean,
                    "student_id": exact_stu.id,
                    "student_name": user_obj.full_name if user_obj else "Student",
                    "student_enrollment": exact_stu.enrollment_number,
                    "confidence": 0.99,
                    "status": AIAttendanceMatchStatus.AUTO_MATCHED.value,
                    "match_reason": "Exact database match",
                    "source_text": source,
                    "marked_present": True
                })
                matched_student_ids.add(exact_stu.id)
                continue

            # ── PRIORITY 2: OCR-normalized exact match against ALL students ──
            if normalized != raw_clean:
                norm_stu = all_map_exact.get(normalized)
                if norm_stu:
                    user_obj = student_user_map.get(norm_stu.user_id)
                    results.append({
                        "enrollment_number": raw,
                        "normalized_enrollment": normalized,
                        "student_id": norm_stu.id,
                        "student_name": user_obj.full_name if user_obj else "Student",
                        "student_enrollment": norm_stu.enrollment_number,
                        "confidence": 0.95,
                        "status": AIAttendanceMatchStatus.AUTO_MATCHED.value,
                        "match_reason": f"OCR correction: '{raw}' -> '{norm_stu.enrollment_number}'",
                        "source_text": source,
                        "marked_present": True
                    })
                    matched_student_ids.add(norm_stu.id)
                    continue

            # ── PRIORITY 3: Controlled fuzzy match against ALL students ──
            # STRICT GUARD: Never fuzzy-match enrollment numbers that only
            # differ in trailing sequence digits (those are different students).
            best_stu: Optional[Student] = None
            best_sim = 0.0
            for enr_key, stu in all_map_exact.items():
                # Skip if the only difference is in trailing digits
                if cls._differs_only_in_trailing_digits(raw_clean, enr_key):
                    continue
                if cls._differs_only_in_trailing_digits(normalized, enr_key):
                    continue

                sim1 = cls.calculate_levenshtein_ratio(raw_clean, enr_key)
                sim2 = cls.calculate_levenshtein_ratio(normalized, enr_key)
                sim = max(sim1, sim2)
                if sim > best_sim:
                    best_sim = sim
                    best_stu = stu

            if best_stu and best_sim >= 0.82:
                user_obj = student_user_map.get(best_stu.user_id)
                results.append({
                    "enrollment_number": raw,
                    "normalized_enrollment": normalized,
                    "student_id": best_stu.id,
                    "student_name": user_obj.full_name if user_obj else "Student",
                    "student_enrollment": best_stu.enrollment_number,
                    "confidence": round(best_sim, 2),
                    "status": AIAttendanceMatchStatus.REVIEW_REQUIRED.value,
                    "match_reason": f"Fuzzy match ({int(best_sim * 100)}%) with {best_stu.enrollment_number}",
                    "source_text": source,
                    "marked_present": True
                })
                matched_student_ids.add(best_stu.id)
                continue

            # ── PRIORITY 4: Unmatched / Not Found ──
            results.append({
                "enrollment_number": raw,
                "normalized_enrollment": normalized,
                "student_id": None,
                "student_name": "Unknown Student",
                "student_enrollment": None,
                "confidence": 0.40,
                "status": AIAttendanceMatchStatus.NOT_FOUND.value,
                "match_reason": "No student found matching this enrollment number",
                "source_text": source,
                "marked_present": False
            })

        return results

    @staticmethod
    async def verify_faculty_subject_assignment(
        faculty_id: int,
        subject_id: int,
        db: AsyncSession,
        current_user: User
    ) -> bool:
        """
        Strict server-side authorization check.
        Ensures the faculty is actually assigned to the subject.
        """
        # Admins have full access
        if getattr(current_user, "is_superuser", False):
            return True
        if "role" in current_user.__dict__ and current_user.__dict__["role"]:
            if getattr(current_user.role, "name", "").lower() == "admin":
                return True
        elif hasattr(current_user, "role_id") and current_user.role_id:
            role_name = await db.scalar(select(Role.name).where(Role.id == current_user.role_id))
            if role_name and role_name.lower() == "admin":
                return True

        if not faculty_id:
            return False

        # Direct Subject.faculty_id
        is_direct = await db.scalar(
            select(Subject.id).where(
                Subject.id == subject_id,
                Subject.faculty_id == faculty_id
            )
        )
        if is_direct:
            return True

        # SubjectAssignment table
        is_assigned = await db.scalar(
            select(SubjectAssignment.id).where(
                SubjectAssignment.faculty_id == faculty_id,
                SubjectAssignment.subject_id == subject_id
            )
        )
        if is_assigned:
            return True

        # Timetable assignment
        is_tt = await db.scalar(
            select(Timetable.id).where(
                Timetable.faculty_id == faculty_id,
                Timetable.subject_id == subject_id
            )
        )
        if is_tt:
            return True

        return False

    @staticmethod
    async def check_existing_attendance(
        subject_id: int,
        target_date: date,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """Check if attendance for this subject and date has already been recorded."""
        count = await db.scalar(
            select(func.count(Attendance.id)).where(
                Attendance.subject_id == subject_id,
                Attendance.date == target_date
            )
        ) or 0

        return {
            "already_exists": count > 0,
            "existing_count": count,
            "warning_message": (
                f"Attendance has already been recorded for this subject on {target_date.strftime('%d %B %Y')} "
                f"({count} records). Submitting again will prevent duplicate student entries."
                if count > 0 else None
            )
        }
