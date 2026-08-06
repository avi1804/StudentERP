from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.services.ai_service import ai_service
from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User

# Import dashboard functions for real-time context
from app.api.v1.student_dashboard import get_dashboard, get_profile, get_attendance

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Endpoint for the AI Chatbot. 
    It takes a user query and returns an AI-generated response.
    Requires authentication to provide context if needed.
    """
    
    role_name = current_user.role.name if current_user.role else "Unknown"
    context_data = {
        "User Role": role_name,
        "User Name": current_user.full_name,
        "User Email": current_user.email,
        "Real-Time Data": "Not Available (Not a student)"
    }
    
    # If the user is a student, fetch their real-time DB data
    if role_name.lower() == "student":
        try:
            dashboard = await get_dashboard(db, current_user)
            profile = await get_profile(db, current_user)
            attendance = await get_attendance(None, db, current_user)
            
            # Remove calendarData to save prompt space
            if "calendarData" in attendance:
                del attendance["calendarData"]
                
            context_data["Real-Time Data"] = {
                "Profile": profile,
                "Dashboard": dashboard,
                "Attendance Detailed": attendance
            }
        except Exception as e:
            context_data["Real-Time Data"] = f"Error fetching student data: {str(e)}"
    
    context_json = json.dumps(context_data, indent=2, default=str)
    
    response_text = await ai_service.get_response(request.query, context_json)
    
    return ChatResponse(response=response_text)
