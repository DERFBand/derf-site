# D.E.R.F. Backend

Run on VPS (no Docker) — quick steps:

1. Put backend to /srv/derf-backend (or preferred path).
2. Create Python venv and install requirements:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

3. Create .env from .env.example and fill values.
4. Create Postgres DB and user, then initialize tables:
   python -c "from app.db.session import init_db; import asyncio; asyncio.run(init_db())"

5. Start via systemd using provided unit, or for testing:
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4

6. Configure nginx to serve /media and proxy / to uvicorn.