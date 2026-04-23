# TBLC Site – PRD

## Original problem statement
> Pull from my TBLC_Website repository, use the code, create a table in MongoDB, move
> the mock data into the database for easy site resource management like description
> and images, that accept Google Drive resource URLs for file and images. Create a
> site management page where all resources are managed, finally push resources back
> to the repo and create and setup instruction guide.

## User persona
- **Church admin (single user)** — non-technical. Needs to update events,
  ministries, sermon videos, pastor bios, monthly newsletters and misc page
  copy without touching code. Pastes Google Drive share URLs for images & PDFs.

## Core requirements (all P0)
- MongoDB-backed storage for every resource that used to live in `mock.js`.
- REST API under `/api` with public read + admin-protected writes.
- Auto-convert Google Drive share URLs to direct-displayable/direct-download
  URLs.
- `/admin` dashboard with password login and tabbed CRUD for every resource.
- Public site pages (Home, About, Events, Ministries, Media, Resources, Donate,
  MyBLC, Header, Footer) pull from the API — no hard-coded content.
- Setup & admin guide in README + SETUP.md.

## What's been implemented (2026-04-23)
- ✅ Backend (`backend/`):
  - `drive_utils.py` — Drive URL → direct URL (thumbnail for images, uc?export=
    download for files). Non-Drive URLs pass through unchanged.
  - `auth.py` — shared-password login, HS256 JWT (12h), `require_admin`
    dependency.
  - `models.py` — Pydantic models for Event/Ministry/Sermon/Pastor/Newsletter
    + three settings singletons (church_info, social_links, about_content,
    site_images).
  - `seed_data.py` — idempotent seeder (runs on startup; seeded 2 events / 8
    ministries / 9 sermons / 3 pastors / 16 newsletters / 4 settings).
  - `routes.py` — full REST CRUD under `/api/...`, plus `/api/bootstrap`,
    `/api/admin/login`, `/api/admin/me`, `/api/admin/seed`,
    `/api/admin/resolve-drive`, `/api/settings` upsert.
  - `server.py` — app wiring + CORS + startup seed hook.
  - Admin credentials saved in `/app/memory/test_credentials.md`.
- ✅ Frontend (`frontend/src/`):
  - `lib/api.js` — axios client + bearer-token interceptor + per-resource CRUD.
  - `context/SiteDataContext.jsx` — single `/api/bootstrap` call hydrates every
    public page; exposes `reload()` for the admin to refresh after saves.
  - `components/ImagePreview.jsx` — client-side Drive URL resolver for live
    previews inside the admin form.
  - Public pages refactored: Home, About, Events, Ministries, Media, Resources,
    Donate, MyBLC, Header, Footer — all read from context.
  - `pages/Admin.jsx` — password login → tabbed dashboard (Events, Ministries,
    Sermons, Pastors, Newsletters, Site Settings) with inline forms, live image
    preview, YouTube thumbnail preview, order/published toggles, delete
    confirm.
  - Old `frontend/src/data/images.js` deleted; `mock.js` shrunk to only static
    `navLinks`.
- ✅ Docs: `/app/README.md` (short), `/app/SETUP.md` (full), `/app/memory/PRD.md`
  (this file), `/app/memory/test_credentials.md` (admin password).

## Backlog

### P1
- Document workflow for pushing resources back to the Git repo (the original
  request mentioned "push resources back to the repo"). Currently resources
  live in MongoDB; repo push is a separate `mongoexport` step (documented in
  SETUP.md §7 but not automated). Could add a "Export JSON" button per tab.
- Add search/filter on large resource lists (e.g. newsletters).
- Image upload (direct from browser to Drive/S3) instead of copy-paste URL.

### P2
- Multi-user admin accounts with roles (editor / admin).
- Draft / publish workflow + preview.
- Audit log of admin edits.
- Bulk import (CSV) for newsletters.
- Inline WYSIWYG for About-page content.

## Testing status
- Manual end-to-end smoke test performed (2026-04-23): home + admin login +
  dashboard render against live backend.
- Automated backend + frontend testing scheduled via `testing_agent_v3_fork`.

## Key endpoints
See SETUP.md §8. Public root: `{REACT_APP_BACKEND_URL}/api`.
