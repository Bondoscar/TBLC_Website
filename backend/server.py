"""FastAPI entrypoint for TBLC site."""
from __future__ import annotations

import logging
import os
import traceback
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="TBLC API")

# Routes
from routes import build_api_router  # noqa: E402
from seed_data import seed_if_empty  # noqa: E402

app.include_router(build_api_router(db))

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exc_handler(request: Request, exc: Exception):
    """Log the real exception and return a JSON error (browsers will still
    see CORS headers because CORSMiddleware processes responses from this
    handler)."""
    logger.exception("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"{type(exc).__name__}: {exc}",
            "path": request.url.path,
        },
    )


@app.on_event("startup")
async def on_startup():
    try:
        inserted = await seed_if_empty(db)
        logger.info("Seed complete: %s", inserted)
    except Exception as e:  # noqa: BLE001
        logger.exception("Seed failed: %s", e)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
