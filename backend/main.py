"""Deployment entrypoint alias.

Emergent's native deployment runner invokes `uvicorn main:app`, while the
preview/supervisor config uses `uvicorn server:app`. Both paths must resolve
to the same FastAPI app instance — so we re-export it here.
"""
from server import app  # noqa: F401
