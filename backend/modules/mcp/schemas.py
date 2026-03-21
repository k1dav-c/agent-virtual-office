from pydantic import BaseModel


class AuthResult(BaseModel):
    user_id: str
    api_key_id: str
