from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

# Simple in-memory connection manager (single-process)
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

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
                # if sending fails, remove connection
                self.disconnect(room, ws)

manager = ConnectionManager()

@router.websocket('/ws/{room}')
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(room, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(room, data)
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)