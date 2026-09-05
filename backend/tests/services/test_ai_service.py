import pytest
from app.services.ai_service import ai_service
from app.services.puter_ai import PuterAI, puter_chat, async_puter_chat

@pytest.mark.asyncio
async def test_puter_ai_initialization():
    ai = PuterAI()
    assert ai._llm_type == "puter-ai"
    assert ai.model_name == "gpt-5.4-nano"

@pytest.mark.asyncio
async def test_ai_service_response():
    resp = await ai_service.get_response("Hello, what is your role?")
    assert isinstance(resp, str)
    assert len(resp) > 0
