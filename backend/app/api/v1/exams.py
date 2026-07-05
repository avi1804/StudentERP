from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_exams():
    return {"message": "Exams endpoint"}
