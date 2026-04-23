"""Google Drive URL utilities.

Accepts any Google Drive URL (file/d/, open?id=, uc?id=, docs.google.com/*/d/, or raw FILE_ID)
and returns a direct-access URL that can be used as <img src> or a file download link.

Reference (Drive direct link patterns):
  Image (via Drive thumbnail endpoint, size controllable):
      https://drive.google.com/thumbnail?id=FILE_ID&sz=w2000
  File download:
      https://drive.google.com/uc?export=download&id=FILE_ID
"""
from __future__ import annotations

import re
from typing import Optional

DRIVE_HOSTS = ("drive.google.com", "docs.google.com", "lh3.googleusercontent.com")

# Patterns for extracting the FILE_ID from common Google Drive URL shapes
_PATTERNS = [
    re.compile(r"/file/d/([a-zA-Z0-9_-]{10,})"),
    re.compile(r"/d/([a-zA-Z0-9_-]{10,})"),
    re.compile(r"[?&]id=([a-zA-Z0-9_-]{10,})"),
    re.compile(r"/thumbnail\?.*id=([a-zA-Z0-9_-]{10,})"),
]

# A raw FILE_ID looks like this (alphanumerics plus - and _, typically 25+ chars)
_RAW_ID_RE = re.compile(r"^[a-zA-Z0-9_-]{20,}$")


def is_drive_url(url: str) -> bool:
    if not url:
        return False
    return any(h in url for h in DRIVE_HOSTS)


def extract_drive_id(url: str) -> Optional[str]:
    """Return the Google Drive FILE_ID from a URL, or None if not a Drive URL.

    Also accepts raw FILE_IDs (20+ char alphanumeric/_/-).
    """
    if not url:
        return None
    url = url.strip()

    # Already a raw FILE_ID
    if _RAW_ID_RE.match(url):
        return url

    # Try each pattern
    for pat in _PATTERNS:
        m = pat.search(url)
        if m:
            return m.group(1)
    return None


def to_direct_image_url(url: str, size: int = 2000) -> str:
    """Convert a Google Drive URL to a direct-viewable image URL.

    Non-Drive URLs are returned unchanged (so external CDN URLs still work).
    """
    if not url:
        return url
    if not is_drive_url(url) and not _RAW_ID_RE.match(url.strip()):
        return url
    fid = extract_drive_id(url)
    if not fid:
        return url
    return f"https://drive.google.com/thumbnail?id={fid}&sz=w{size}"


def to_direct_file_url(url: str) -> str:
    """Convert a Google Drive URL to a direct-download file URL.

    Non-Drive URLs are returned unchanged.
    """
    if not url:
        return url
    if not is_drive_url(url) and not _RAW_ID_RE.match(url.strip()):
        return url
    fid = extract_drive_id(url)
    if not fid:
        return url
    return f"https://drive.google.com/uc?export=download&id={fid}"


def resolve_url(url: str, kind: str = "image", size: int = 2000) -> str:
    """Generic helper: kind='image' or 'file'. Returns original if not a Drive URL."""
    if kind == "file":
        return to_direct_file_url(url)
    return to_direct_image_url(url, size=size)
