"""
Auth Module - API Routes
"""

import jwt
from core.auth import CurrentUserDep, verify_id_token
from core.dependencies import ContextDep
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from .schemas import Auth0User, Auth0WebhookResponse
from .services import AuthService

router = APIRouter()


@router.post("/auth0/jwt_claim", response_model=Auth0WebhookResponse)
async def auth0_webhook_receiver(
    body: Auth0User, ctx: ContextDep
) -> Auth0WebhookResponse:
    """
    Receives and processes Auth0 webhook events, typically for new user sign-ups.
    """
    ctx.logger.info(
        "Received Auth0 webhook request",
        extra={"user_id": body.user.user_id, "email": body.user.email},
    )

    try:
        # Emit an event to a message queue for asynchronous processing
        await ctx.emit({"topic": "auth0.webhook.received", "data": body.model_dump()})

        # For a faster response, you can also handle the primary logic here directly
        # and let the consumer handle secondary tasks (e.g., sending welcome emails).
        user_result = await AuthService.upsert_user(body.user, ctx)
        user_id = user_result["user_id"]

        # Example of further processing: get related data
        device_ids = await AuthService.get_user_device_ids(user_id, ctx)
        is_admin = await AuthService.is_user_admin(user_id, ctx)

        ctx.logger.info(
            "Auth0 webhook processed successfully",
            extra={
                "user_id": user_id,
                "device_count": len(device_ids),
                "is_admin": is_admin,
            },
        )

        return Auth0WebhookResponse(
            message="Webhook processed successfully.",
            id=user_id,
            device_ids=device_ids,
            role="admin" if is_admin else "user",
        )

    except Exception as error:
        ctx.logger.error(
            "Failed to process Auth0 webhook",
            extra={"error": str(error)},
        )
        # Depending on requirements, you might want to raise an HTTPException here
        # Log the error and let the client receive a 500
        raise


@router.get("/me")
async def get_me(user: CurrentUserDep):
    """Return current user info from verified id_token."""
    return {
        "sub": user.get("sub"),
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
    }


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """WebSocket endpoint with first-message token verification."""
    await ws.accept()

    # Wait for connection_init message with token
    try:
        init_msg = await ws.receive_json()
    except Exception:
        await ws.close(code=4001, reason="Expected connection_init")
        return

    if init_msg.get("type") != "connection_init":
        await ws.close(code=4001, reason="Expected connection_init")
        return

    token = init_msg.get("payload", {}).get("token")
    if not token:
        await ws.close(code=4001, reason="Missing token")
        return

    try:
        payload = verify_id_token(token)
    except (jwt.InvalidTokenError, Exception):
        await ws.send_json({"type": "connection_error", "message": "Invalid token"})
        await ws.close(code=4001, reason="Invalid token")
        return

    user_sub = payload.get("sub", "unknown")
    await ws.send_json(
        {"type": "connection_ack", "message": f"Connected as {user_sub}"}
    )

    try:
        while True:
            data = await ws.receive_text()
            await ws.send_json({"type": "echo", "message": data})
    except WebSocketDisconnect:
        pass
