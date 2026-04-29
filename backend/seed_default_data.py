from __future__ import annotations

import asyncio

from app.crud import seed_default_content
from app.db.session import init_db


async def main() -> None:
    await init_db()
    await seed_default_content()


if __name__ == "__main__":
    asyncio.run(main())
