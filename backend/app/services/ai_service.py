from google import genai
from google.genai import types
from pydantic import BaseModel
import os
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.system_instruction = """
        You are an intelligent AI assistant for the Student ERP System.
        The ERP system manages student enrollments, fee management, academic tracking, and placements.
        You should assist users (students, faculty, admins) with their queries.
        Be helpful, concise, and professional.
        """

    async def get_response(self, user_query: str, user_context: str = "") -> str:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return "I am currently unavailable as the Gemini API key is not configured on the server."
            
        try:
            client = genai.Client(api_key=api_key)
            
            dynamic_instruction = self.system_instruction
            if user_context:
                dynamic_instruction += f"\n\nContext about the current user (Use this to answer user specific queries accurately):\n{user_context}"
                
            # We use gemini-3.5-flash as the default model
            response = await client.aio.models.generate_content(
                model='gemini-3.5-flash',
                contents=user_query,
                config=types.GenerateContentConfig(
                    system_instruction=dynamic_instruction,
                    temperature=0.7,
                ),
            )
            return response.text
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            import traceback
            traceback.print_exc()
            return f"Error: {str(e)}"

ai_service = AIService()
