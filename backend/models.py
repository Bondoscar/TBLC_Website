"""Pydantic models for TBLC site resources."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
import uuid

from pydantic import BaseModel, ConfigDict, Field


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Shared mixins
# ---------------------------------------------------------------------------
class BaseDoc(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str = Field(default_factory=_uuid)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------
class EventBase(BaseModel):
    title: str
    date: str                      # free-form: "Sunday, April 19"
    time: str = ""                 # free-form: "10AM"
    description: str = ""
    image_url: str = ""            # Google Drive URL or external URL
    order: int = 0                 # for sorting
    published: bool = True


class EventCreate(EventBase):
    pass


class Event(BaseDoc, EventBase):
    image_direct_url: str = ""     # auto-computed direct URL used by frontend


# ---------------------------------------------------------------------------
# Ministries
# ---------------------------------------------------------------------------
class MinistryBase(BaseModel):
    slug: str                      # e.g. "kids"
    title: str
    description: str = ""
    image_url: str = ""
    order: int = 0
    published: bool = True


class MinistryCreate(MinistryBase):
    pass


class Ministry(BaseDoc, MinistryBase):
    image_direct_url: str = ""


# ---------------------------------------------------------------------------
# Sermons
# ---------------------------------------------------------------------------
class SermonBase(BaseModel):
    title: str
    speaker: str = ""
    duration: str = ""            # e.g. "41:10"
    youtube_id: str = ""
    order: int = 0
    published: bool = True


class SermonCreate(SermonBase):
    pass


class Sermon(BaseDoc, SermonBase):
    pass


# ---------------------------------------------------------------------------
# Pastors
# ---------------------------------------------------------------------------
class PastorBase(BaseModel):
    name: str
    role: str = ""
    image_url: str = ""
    order: int = 0
    published: bool = True


class PastorCreate(PastorBase):
    pass


class Pastor(BaseDoc, PastorBase):
    image_direct_url: str = ""


# ---------------------------------------------------------------------------
# Newsletters
# ---------------------------------------------------------------------------
class NewsletterBase(BaseModel):
    month: str                     # e.g. "April 2026"
    file_url: str = ""             # Google Drive URL or external PDF URL
    order: int = 0
    published: bool = True


class NewsletterCreate(NewsletterBase):
    pass


class Newsletter(BaseDoc, NewsletterBase):
    file_direct_url: str = ""      # direct-download URL


# ---------------------------------------------------------------------------
# Singleton settings docs (stored in `site_settings` with `key` as identifier)
# ---------------------------------------------------------------------------
class ChurchInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    address: str = ""
    phone: str = ""
    email: str = ""
    sunday_service: str = ""
    bible_study: str = ""
    prayer: str = ""


class SocialLinks(BaseModel):
    model_config = ConfigDict(extra="ignore")

    facebook: str = ""
    instagram: str = ""
    youtube: str = ""
    map: str = ""
    podcast: str = ""


class AboutContent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    hero: str = ""
    intro: str = ""
    mission: str = ""
    vision: str = ""
    beliefs: List[str] = Field(default_factory=list)


class SiteImages(BaseModel):
    """Top-level hero/worship/banner images. Each field accepts a Google Drive URL."""
    model_config = ConfigDict(extra="ignore")

    hero: str = ""
    worship: str = ""
    banner: str = ""
    # Direct-view URLs are computed by the backend on read
    hero_direct: str = ""
    worship_direct: str = ""
    banner_direct: str = ""


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str
    expires_in: int = 60 * 60 * 12  # 12h


# ---------------------------------------------------------------------------
# Drive URL resolver endpoint
# ---------------------------------------------------------------------------
class ResolveDriveRequest(BaseModel):
    url: str
    kind: str = "image"            # "image" or "file"
    size: int = 2000


class ResolveDriveResponse(BaseModel):
    original_url: str
    direct_url: str
    file_id: Optional[str] = None
    is_drive: bool = False
