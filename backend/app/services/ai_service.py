import logging
import traceback
from typing import Optional

from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from app.services.puter_ai import PuterAI

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.system_instruction = """
        You are Yuna, an intelligent AI assistant for the Student ERP System.
        The ERP system manages student enrollments, fee management, academic tracking, timetables, and placements.
        You should assist users (students, faculty, admins) with their queries.
        Be helpful, warm, concise, and professional.
        
        CRITICAL FORMATTING INSTRUCTIONS (STRICT RULE):
        1. DO NOT use raw markdown asterisks (*, **, ***) or dashes/hyphens (-) anywhere in your response.
        2. DO NOT format list items using asterisks (* item) or hyphens (- item).
        3. ALWAYS use clean line breaks, relevant emojis (such as 📊, ✅, ❌, 📌, 🎓, 📚, 💡, 🔹, 📈, ➡️), and plain clear titles to structure information beautifully.
        4. Organize information into distinct, clean sections with clear line spacing between paragraphs.
        
        GRAPHICAL WIDGETS:
        If a user asks about their attendance or grades, you MUST output a special JSON block at the very end of your response to render a graphical widget.
        Format it exactly like this inside a markdown code block:
        ```widget
        {
          "type": "attendance_card",
          "data": {
            "subject": "Machine Learning (7th Semester)",
            "present": 42,
            "absent": 8,
            "total": 50,
            "percentage": 84
          }
        }
        ```
        Extract the actual real data from the user's context if available, otherwise use placeholders if answering generally.
        """

    async def get_response(self, user_query: str, user_context: str = "") -> str:
        token = settings.PUTER_AUTH_TOKEN
        if not token:
            return "I am currently unavailable as the Puter AI authentication token is not configured on the server."
            
        try:
            dynamic_instruction = self.system_instruction
            if user_context:
                dynamic_instruction += f"\n\nContext about the current user (Use this to answer user specific queries accurately):\n{user_context}"
                
            model = PuterAI(
                model=settings.PUTER_MODEL,
                auth_token=token,
                temperature=0.7,
            )

            messages = [
                SystemMessage(content=dynamic_instruction),
                HumanMessage(content=user_query),
            ]

            response = await model.ainvoke(messages)
            return str(response.content)
        except Exception as e:
            logger.error(f"Error generating AI response with Puter AI: {str(e)}")
            traceback.print_exc()
            return f"Error: {str(e)}"

ai_service = AIService()

