import os
import json
import logging
from typing import Any, Callable, Dict, List, Optional, Sequence, Union

from dotenv import load_dotenv
import requests
import httpx

# Fix potential OpenMP conflict on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))

from langchain_core.callbacks import CallbackManagerForLLMRun, AsyncCallbackManagerForLLMRun
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    ChatMessage,
    FunctionMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.utils.function_calling import convert_to_openai_tool
from pydantic import Field

logger = logging.getLogger(__name__)


class PuterAI(BaseChatModel):
    """
    Puter AI Chat Model integration with full LangChain / LangGraph & Tool Calling support.
    Supports both synchronous and asynchronous execution.
    """
    model_name: str = Field(default="gpt-5.4-nano", alias="model")
    auth_token: Optional[str] = Field(default=None)
    temperature: Optional[float] = Field(default=None)
    max_tokens: Optional[int] = Field(default=None)
    bound_tools: Optional[List[Dict[str, Any]]] = Field(default=None)
    api_url: str = "https://api.puter.com/drivers/call"

    def __init__(
        self,
        model: str = "gpt-5.4-nano",
        auth_token: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        **kwargs: Any
    ):
        token = auth_token or os.getenv("PUTER_AUTH_TOKEN", "")
        super().__init__(
            model=model,
            auth_token=token,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs
        )

    @property
    def _llm_type(self) -> str:
        return "puter-ai"

    def _convert_message_to_dict(self, message: BaseMessage) -> Dict[str, Any]:
        if isinstance(message, HumanMessage):
            return {"role": "user", "content": message.content}
        elif isinstance(message, SystemMessage):
            return {"role": "system", "content": message.content}
        elif isinstance(message, AIMessage):
            msg_dict: Dict[str, Any] = {"role": "assistant", "content": message.content or ""}
            if message.tool_calls:
                msg_dict["tool_calls"] = [
                    {
                        "id": tc.get("id"),
                        "type": "function",
                        "function": {
                            "name": tc.get("name"),
                            "arguments": json.dumps(tc.get("args", {})) if isinstance(tc.get("args"), dict) else str(tc.get("args", ""))
                        }
                    }
                    for tc in message.tool_calls
                ]
            return msg_dict
        elif isinstance(message, ToolMessage):
            return {
                "role": "tool",
                "tool_call_id": message.tool_call_id,
                "content": str(message.content)
            }
        elif isinstance(message, FunctionMessage):
            return {
                "role": "function",
                "name": message.name,
                "content": str(message.content)
            }
        else:
            return {"role": "user", "content": str(message.content)}

    def _build_payload(self, messages: List[BaseMessage], **kwargs: Any) -> tuple[Dict[str, str], Dict[str, Any]]:
        token = self.auth_token or os.getenv("PUTER_AUTH_TOKEN", "")
        if not token:
            raise ValueError(
                "PUTER_AUTH_TOKEN is missing! Set it in your .env file or pass auth_token to PuterAI()."
            )

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        formatted_messages = [self._convert_message_to_dict(m) for m in messages]

        args: Dict[str, Any] = {
            "messages": formatted_messages,
            "model": kwargs.get("model", self.model_name),
        }

        temp = kwargs.get("temperature", self.temperature)
        if temp is not None:
            args["temperature"] = temp

        max_tok = kwargs.get("max_tokens", self.max_tokens)
        if max_tok is not None:
            args["max_tokens"] = max_tok

        tools = kwargs.get("tools", self.bound_tools)
        if tools:
            args["tools"] = tools

        payload = {
            "interface": "puter-chat-completion",
            "driver": "ai-chat",
            "test_mode": False,
            "method": "complete",
            "args": args,
            "auth_token": token
        }

        return headers, payload

    def _parse_response_data(self, data: Dict[str, Any]) -> ChatResult:
        result = data.get("result", {})
        msg_obj = result.get("message", {})

        content = msg_obj.get("content") or ""
        tool_calls_raw = msg_obj.get("tool_calls", [])

        tool_calls = []
        for tc in tool_calls_raw:
            func = tc.get("function", {})
            raw_args = func.get("arguments", "{}")
            try:
                parsed_args = json.loads(raw_args) if isinstance(raw_args, str) else raw_args
            except json.JSONDecodeError:
                parsed_args = {"raw": raw_args}

            tool_calls.append({
                "name": func.get("name"),
                "args": parsed_args,
                "id": tc.get("id"),
                "type": "tool_call"
            })

        ai_message = AIMessage(
            content=content,
            tool_calls=tool_calls
        )

        generation = ChatGeneration(message=ai_message)
        return ChatResult(generations=[generation])

    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        headers, payload = self._build_payload(messages, **kwargs)

        response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
        if response.status_code != 200:
            raise RuntimeError(f"Puter API Error ({response.status_code}): {response.text}")

        data = response.json()
        return self._parse_response_data(data)

    async def _agenerate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[AsyncCallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        headers, payload = self._build_payload(messages, **kwargs)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(self.api_url, headers=headers, json=payload)
            if response.status_code != 200:
                raise RuntimeError(f"Puter API Error ({response.status_code}): {response.text}")
            data = response.json()

        return self._parse_response_data(data)

    def bind_tools(
        self,
        tools: Sequence[Union[Dict[str, Any], Any]],
        **kwargs: Any,
    ) -> "PuterAI":
        """
        Binds tool definitions to the Puter AI model for function calling.
        """
        formatted_tools = [convert_to_openai_tool(t) for t in tools]
        return self.__class__(
            model=self.model_name,
            auth_token=self.auth_token,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            bound_tools=formatted_tools,
            **kwargs
        )


# Convenience synchronous helper
def puter_chat(prompt: str, model: str = "gpt-5.4-nano", **kwargs: Any) -> str:
    ai = PuterAI(model=model)
    res = ai.invoke(prompt, **kwargs)
    return str(res.content)


# Convenience asynchronous helper
async def async_puter_chat(prompt: str, model: str = "gpt-5.4-nano", **kwargs: Any) -> str:
    ai = PuterAI(model=model)
    res = await ai.ainvoke(prompt, **kwargs)
    return str(res.content)
