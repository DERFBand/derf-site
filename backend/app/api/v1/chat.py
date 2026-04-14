from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlmodel import select

from app.db.session import AsyncSessionLocal
from app.models import ChatMessage

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(room, []).append(websocket)

    def disconnect(self, room: str, websocket: WebSocket):
        if room in self.active_connections:
            try:
                self.active_connections[room].remove(websocket)
            except ValueError:
                pass

    async def broadcast(self, room: str, message: str):
        conns = list(self.active_connections.get(room, []))
        for ws in conns:
            try:
                await ws.send_text(message)
            except Exception:
                self.disconnect(room, ws)


manager = ConnectionManager()


@router.websocket('/ws/{room}')
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(room, websocket)
    try:
        async with AsyncSessionLocal() as session:
            while True:
                data = await websocket.receive_text()
                session.add(ChatMessage(room=room, content=data))
                await session.commit()
                await manager.broadcast(room, data)
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)


@router.get('/chat/messages/{room}')
async def get_messages(room: str):
    async with AsyncSessionLocal() as session:
        result = await session.exec(select(ChatMessage).where(ChatMessage.room == room).order_by(ChatMessage.sent_at.asc()))
        return [
            {
                'id': message.id,
                'room': message.room,
                'sender_id': message.sender_id,
                'content': message.content,
                'sent_at': message.sent_at.isoformat() if message.sent_at else None,
            }
            for message in result.all()
        ]
