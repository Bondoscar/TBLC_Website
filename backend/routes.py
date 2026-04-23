"""REST routes for TBLC site resources.

All write endpoints require `Authorization: Bearer <admin-token>`.
Public GET endpoints are unauthenticated.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel


class SettingBody(BaseModel):
    value: Dict[str, Any]

from auth import issue_token, require_admin, verify_password
from drive_utils import (
    is_drive_url,
    resolve_url,
    to_direct_file_url,
    to_direct_image_url,
)
from models import (
    Event,
    EventCreate,
    LoginRequest,
    LoginResponse,
    Ministry,
    MinistryCreate,
    Newsletter,
    NewsletterCreate,
    Pastor,
    PastorCreate,
    ResolveDriveRequest,
    ResolveDriveResponse,
    Sermon,
    SermonCreate,
)
from seed_data import seed_if_empty

logger = logging.getLogger(__name__)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _new_doc(base: Dict[str, Any]) -> Dict[str, Any]:
    return {
        **base,
        "id": str(uuid.uuid4()),
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    }


# ---------------------------------------------------------------------------
# Router factory – wires DB handle into routes
# ---------------------------------------------------------------------------
def build_api_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api")

    # -----------------------------------------------------------------------
    # Auth + admin utilities
    # -----------------------------------------------------------------------
    @router.post("/admin/login", response_model=LoginResponse)
    async def admin_login(body: LoginRequest):
        if not verify_password(body.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
            )
        token = issue_token()
        return LoginResponse(token=token)

    @router.get("/admin/me")
    async def admin_me(_admin=Depends(require_admin)):
        return {"role": "admin", "ok": True}

    @router.post("/admin/seed")
    async def admin_seed(_admin=Depends(require_admin)):
        inserted = await seed_if_empty(db)
        return {"inserted": inserted}

    @router.post("/admin/resolve-drive", response_model=ResolveDriveResponse)
    async def resolve_drive(body: ResolveDriveRequest, _admin=Depends(require_admin)):
        direct = resolve_url(body.url, kind=body.kind, size=body.size)
        from drive_utils import extract_drive_id

        return ResolveDriveResponse(
            original_url=body.url,
            direct_url=direct,
            file_id=extract_drive_id(body.url),
            is_drive=is_drive_url(body.url),
        )

    # -----------------------------------------------------------------------
    # Generic CRUD helpers
    # -----------------------------------------------------------------------
    async def _list(collection: str, published_only: bool = False) -> List[Dict[str, Any]]:
        q: Dict[str, Any] = {}
        if published_only:
            q["published"] = True
        docs = await db[collection].find(q, {"_id": 0}).sort("order", 1).to_list(1000)
        return docs

    async def _get(collection: str, id: str) -> Dict[str, Any]:
        doc = await db[collection].find_one({"id": id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail=f"{collection[:-1]} not found")
        return doc

    async def _delete(collection: str, id: str) -> Dict[str, Any]:
        res = await db[collection].delete_one({"id": id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="not found")
        return {"deleted": True}

    # -----------------------------------------------------------------------
    # Events
    # -----------------------------------------------------------------------
    @router.get("/events", response_model=List[Event])
    async def list_events(published: bool = False):
        return await _list("events", published_only=published)

    @router.get("/events/{id}", response_model=Event)
    async def get_event(id: str):
        return await _get("events", id)

    @router.post("/events", response_model=Event)
    async def create_event(body: EventCreate, _admin=Depends(require_admin)):
        doc = _new_doc(body.model_dump())
        doc["image_direct_url"] = to_direct_image_url(doc.get("image_url", ""))
        await db.events.insert_one(doc)
        doc.pop("_id", None)
        return doc

    @router.put("/events/{id}", response_model=Event)
    async def update_event(id: str, body: EventCreate, _admin=Depends(require_admin)):
        update = body.model_dump()
        update["image_direct_url"] = to_direct_image_url(update.get("image_url", ""))
        update["updated_at"] = _now_iso()
        res = await db.events.update_one({"id": id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="event not found")
        return await _get("events", id)

    @router.delete("/events/{id}")
    async def delete_event(id: str, _admin=Depends(require_admin)):
        return await _delete("events", id)

    # -----------------------------------------------------------------------
    # Ministries
    # -----------------------------------------------------------------------
    @router.get("/ministries", response_model=List[Ministry])
    async def list_ministries(published: bool = False):
        return await _list("ministries", published_only=published)

    @router.get("/ministries/{id}", response_model=Ministry)
    async def get_ministry(id: str):
        return await _get("ministries", id)

    @router.post("/ministries", response_model=Ministry)
    async def create_ministry(body: MinistryCreate, _admin=Depends(require_admin)):
        doc = _new_doc(body.model_dump())
        doc["image_direct_url"] = to_direct_image_url(doc.get("image_url", ""))
        await db.ministries.insert_one(doc)
        doc.pop("_id", None)
        return doc

    @router.put("/ministries/{id}", response_model=Ministry)
    async def update_ministry(id: str, body: MinistryCreate, _admin=Depends(require_admin)):
        update = body.model_dump()
        update["image_direct_url"] = to_direct_image_url(update.get("image_url", ""))
        update["updated_at"] = _now_iso()
        res = await db.ministries.update_one({"id": id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="ministry not found")
        return await _get("ministries", id)

    @router.delete("/ministries/{id}")
    async def delete_ministry(id: str, _admin=Depends(require_admin)):
        return await _delete("ministries", id)

    # -----------------------------------------------------------------------
    # Sermons
    # -----------------------------------------------------------------------
    @router.get("/sermons", response_model=List[Sermon])
    async def list_sermons(published: bool = False):
        return await _list("sermons", published_only=published)

    @router.get("/sermons/{id}", response_model=Sermon)
    async def get_sermon(id: str):
        return await _get("sermons", id)

    @router.post("/sermons", response_model=Sermon)
    async def create_sermon(body: SermonCreate, _admin=Depends(require_admin)):
        doc = _new_doc(body.model_dump())
        await db.sermons.insert_one(doc)
        doc.pop("_id", None)
        return doc

    @router.put("/sermons/{id}", response_model=Sermon)
    async def update_sermon(id: str, body: SermonCreate, _admin=Depends(require_admin)):
        update = body.model_dump()
        update["updated_at"] = _now_iso()
        res = await db.sermons.update_one({"id": id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="sermon not found")
        return await _get("sermons", id)

    @router.delete("/sermons/{id}")
    async def delete_sermon(id: str, _admin=Depends(require_admin)):
        return await _delete("sermons", id)

    # -----------------------------------------------------------------------
    # Pastors
    # -----------------------------------------------------------------------
    @router.get("/pastors", response_model=List[Pastor])
    async def list_pastors(published: bool = False):
        return await _list("pastors", published_only=published)

    @router.get("/pastors/{id}", response_model=Pastor)
    async def get_pastor(id: str):
        return await _get("pastors", id)

    @router.post("/pastors", response_model=Pastor)
    async def create_pastor(body: PastorCreate, _admin=Depends(require_admin)):
        doc = _new_doc(body.model_dump())
        doc["image_direct_url"] = to_direct_image_url(doc.get("image_url", ""))
        await db.pastors.insert_one(doc)
        doc.pop("_id", None)
        return doc

    @router.put("/pastors/{id}", response_model=Pastor)
    async def update_pastor(id: str, body: PastorCreate, _admin=Depends(require_admin)):
        update = body.model_dump()
        update["image_direct_url"] = to_direct_image_url(update.get("image_url", ""))
        update["updated_at"] = _now_iso()
        res = await db.pastors.update_one({"id": id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="pastor not found")
        return await _get("pastors", id)

    @router.delete("/pastors/{id}")
    async def delete_pastor(id: str, _admin=Depends(require_admin)):
        return await _delete("pastors", id)

    # -----------------------------------------------------------------------
    # Newsletters
    # -----------------------------------------------------------------------
    @router.get("/newsletters", response_model=List[Newsletter])
    async def list_newsletters(published: bool = False):
        return await _list("newsletters", published_only=published)

    @router.get("/newsletters/{id}", response_model=Newsletter)
    async def get_newsletter(id: str):
        return await _get("newsletters", id)

    @router.post("/newsletters", response_model=Newsletter)
    async def create_newsletter(body: NewsletterCreate, _admin=Depends(require_admin)):
        doc = _new_doc(body.model_dump())
        doc["file_direct_url"] = to_direct_file_url(doc.get("file_url", ""))
        await db.newsletters.insert_one(doc)
        doc.pop("_id", None)
        return doc

    @router.put("/newsletters/{id}", response_model=Newsletter)
    async def update_newsletter(id: str, body: NewsletterCreate, _admin=Depends(require_admin)):
        update = body.model_dump()
        update["file_direct_url"] = to_direct_file_url(update.get("file_url", ""))
        update["updated_at"] = _now_iso()
        res = await db.newsletters.update_one({"id": id}, {"$set": update})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="newsletter not found")
        return await _get("newsletters", id)

    @router.delete("/newsletters/{id}")
    async def delete_newsletter(id: str, _admin=Depends(require_admin)):
        return await _delete("newsletters", id)

    # -----------------------------------------------------------------------
    # Site settings (key/value singleton docs)
    # -----------------------------------------------------------------------
    @router.get("/settings")
    async def list_settings():
        docs = await db.site_settings.find({}, {"_id": 0}).to_list(100)
        return {d["key"]: d.get("value", {}) for d in docs}

    @router.get("/settings/{key}")
    async def get_setting(key: str):
        doc = await db.site_settings.find_one({"key": key}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail=f"setting '{key}' not found")
        return doc

    @router.put("/settings/{key}")
    async def put_setting(key: str, body: SettingBody, _admin=Depends(require_admin)):
        value = dict(body.value)
        # Auto-compute direct URLs for site_images
        if key == "site_images":
            value["hero_direct"] = to_direct_image_url(value.get("hero", ""))
            value["worship_direct"] = to_direct_image_url(value.get("worship", ""))
            value["banner_direct"] = to_direct_image_url(value.get("banner", ""))
        await db.site_settings.update_one(
            {"key": key},
            {"$set": {"key": key, "value": value, "updated_at": _now_iso()}},
            upsert=True,
        )
        return {"key": key, "value": value}

    # -----------------------------------------------------------------------
    # Aggregate bootstrap endpoint (useful for the public frontend)
    # -----------------------------------------------------------------------
    @router.get("/bootstrap")
    async def bootstrap():
        """Single call that returns everything the public site needs."""
        events = await _list("events", published_only=True)
        ministries = await _list("ministries", published_only=True)
        sermons = await _list("sermons", published_only=True)
        pastors = await _list("pastors", published_only=True)
        newsletters = await _list("newsletters", published_only=True)
        settings_docs = await db.site_settings.find({}, {"_id": 0}).to_list(100)
        settings = {d["key"]: d.get("value", {}) for d in settings_docs}
        return {
            "events": events,
            "ministries": ministries,
            "sermons": sermons,
            "pastors": pastors,
            "newsletters": newsletters,
            "settings": settings,
        }

    @router.get("/")
    async def root():
        return {"message": "TBLC API"}

    return router
