# TBLC — Setup & Admin Guide

This document covers everything a site operator needs: running the app, the
admin dashboard, Google Drive URLs, and database backup/restore.

## 1. Architecture

```
frontend/  — React 19 app (Tailwind + shadcn/ui)
backend/   — FastAPI app
    server.py           entrypoint, registers routes and startup seeder
    routes.py           all `/api/...` REST endpoints (events, ministries,
                        sermons, pastors, newsletters, settings, admin)
    models.py           Pydantic models
    drive_utils.py      Google Drive URL → direct URL helpers
    auth.py             shared-password admin login + JWT issuance
    seed_data.py        idempotent MongoDB seeder (runs at startup)
MongoDB collections
    events, ministries, sermons, pastors, newsletters, site_settings
```

Frontend pulls everything via a single `/api/bootstrap` call on load (see
`src/context/SiteDataContext.jsx`). The admin `/admin` page uses the resource-
specific CRUD endpoints.

## 2. Environment variables

Backend (`backend/.env`):

| var              | purpose                                                |
|------------------|--------------------------------------------------------|
| `MONGO_URL`      | Mongo connection string                                |
| `DB_NAME`        | Database name                                          |
| `CORS_ORIGINS`   | Comma-separated origins, or `*`                        |
| `ADMIN_PASSWORD` | Admin dashboard password (shared secret)               |
| `ADMIN_JWT_SECRET` | 32+ byte hex used to sign admin session JWTs         |

Frontend (`frontend/.env`):

| var                    | purpose                             |
|------------------------|-------------------------------------|
| `REACT_APP_BACKEND_URL`| Backend public URL                  |

## 3. First-run seed

On startup the backend runs `seed_if_empty(db)` which inserts the original
content (events, ministries, sermons, pastors, newsletters, site settings) —
only into collections that are currently empty. To re-run manually against
missing collections:

```bash
curl -X POST "$BACKEND/api/admin/seed" \
     -H "Authorization: Bearer $TOKEN"
```

## 4. Admin dashboard

1. Open `{REACT_APP_BACKEND_URL}/admin`.
2. Enter the password stored in `backend/.env` (`ADMIN_PASSWORD`).
3. The session JWT is stored in `localStorage` and lasts 12 hours.

Tabs available:
- **Events / Ministries / Sermons / Pastors / Newsletters** — create / edit /
  delete. Each has an image or file URL field that accepts a Google Drive
  share URL. A live preview is rendered below the field.
- **Site Settings** — Church info, social links, About-page content (hero,
  intro, mission, vision, beliefs), and the three hero images (Hero / Worship
  / Banner).

Changes are saved immediately and the public site refreshes on its next page
load. The dashboard also refreshes the `SiteDataContext` in-memory after each
save so you can click *View site* and see the change.

## 5. Google Drive URLs — how to get them

Any of the following formats are accepted:

- `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- `https://drive.google.com/open?id=FILE_ID`
- `https://drive.google.com/uc?id=FILE_ID`
- `https://docs.google.com/*/d/FILE_ID`
- raw `FILE_ID`

The backend converts them to:
- **Images** → `https://drive.google.com/thumbnail?id=FILE_ID&sz=w2000` (works
  as `<img src>`)
- **Files (newsletters)** → `https://drive.google.com/uc?export=download&id=FILE_ID`

### How to get a shareable Drive URL

1. Upload the image or PDF to Google Drive.
2. Right-click → **Share** → set access to **Anyone with the link** (Viewer).
3. Copy the link and paste it into the admin form.

Any non-Drive URL (public CDN, Unsplash, Pexels, Wix) is passed through
unchanged, so existing images keep working.

## 6. Content operations

- **Images** — paste Drive URL; the admin form shows a preview. Save.
- **Videos (sermons)** — paste only the **YouTube video ID** (the bit after
  `?v=` in the YouTube URL). The site embeds the player automatically.
- **Newsletters** — paste the Drive share link to the PDF; the public site
  turns that into a direct-download link.
- **Order** — the numeric `order` field controls sort order (ascending).
- **Published** — set to `No` to hide an item from the public site while
  keeping it in the database.

## 7. Backup & restore MongoDB

Backup the whole DB:
```bash
mongodump --uri="$MONGO_URL" --db="$DB_NAME" --out ./tblc-backup
```

Restore:
```bash
mongorestore --uri="$MONGO_URL" --db="$DB_NAME" ./tblc-backup/$DB_NAME
```

Export a single collection to JSON (useful for version-controlling content):
```bash
mongoexport --uri="$MONGO_URL" --db="$DB_NAME" --collection=events \
            --out=events.json --jsonArray --pretty
```

## 8. API reference (public)

All endpoints are prefixed with `/api`.

| Method | Path                   | Auth   | Purpose                                 |
|--------|------------------------|--------|-----------------------------------------|
| GET    | `/bootstrap`           | public | Single call — everything the site needs |
| GET    | `/events`              | public | List events (`?published=true` filter)  |
| GET    | `/events/{id}`         | public | Single event                            |
| POST   | `/events`              | admin  | Create event                            |
| PUT    | `/events/{id}`         | admin  | Update event                            |
| DELETE | `/events/{id}`         | admin  | Delete event                            |
| …same for `/ministries`, `/sermons`, `/pastors`, `/newsletters`           |
| GET    | `/settings`            | public | All singleton docs keyed by `key`       |
| GET    | `/settings/{key}`      | public | Single settings doc                     |
| PUT    | `/settings/{key}`      | admin  | Upsert a settings doc                   |
| POST   | `/admin/login`         | public | `{password}` → `{token}`                |
| GET    | `/admin/me`            | admin  | Validate current token                  |
| POST   | `/admin/seed`          | admin  | Re-run seeder against empty collections |
| POST   | `/admin/resolve-drive` | admin  | Debug helper — resolve any Drive URL    |

## 9. Local developer tips

- Backend hot-reloads via supervisor; if models change, `sudo supervisorctl
  restart backend`.
- Frontend hot-reloads with CRA; no restart needed after JSX/CSS changes.
- Logs: `tail -n 200 /var/log/supervisor/backend.*.log`.
