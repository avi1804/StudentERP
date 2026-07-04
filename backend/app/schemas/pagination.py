from typing import Generic, TypeVar, Sequence
from pydantic import BaseModel

T = TypeVar("T")

class Pagination(BaseModel, Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    size: int
    pages: int
