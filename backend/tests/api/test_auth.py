import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    from tests.conftest import TestingSessionLocal
    from app.models.user import Role
    async with TestingSessionLocal() as session:
        role = Role(id=1, name="student", description="Student")
        session.add(role)
        await session.commit()

    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User",
            "role_id": 1
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    from tests.conftest import TestingSessionLocal
    from app.models.user import Role
    async with TestingSessionLocal() as session:
        role = Role(id=1, name="student", description="Student")
        session.add(role)
        await session.commit()

    # Register first
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "loginpassword",
            "full_name": "Login User",
            "role_id": 1
        }
    )
    
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        data={
            "username": "login@example.com",
            "password": "loginpassword",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
