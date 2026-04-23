# The Better Life Church — Website

A full-stack rebuild of the TBLC website with a CMS-style admin dashboard.

Stack:
- **Frontend:** React 19 + React Router 7 + Tailwind + shadcn/ui
- **Backend:** FastAPI + Motor (async MongoDB)
- **Database:** MongoDB (all site content)
- **Image/file URLs:** Any Google Drive share URL — the backend auto-converts it to a displayable/downloadable direct URL.

## Quick start

1. Backend env (`backend/.env`):

   ```
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="test_database"
   CORS_ORIGINS="*"
   ADMIN_PASSWORD="<your admin password>"
   ADMIN_JWT_SECRET="<random 32+ byte hex>"
   ```

2. Frontend env (`frontend/.env`):

   ```
   REACT_APP_BACKEND_URL=https://your-host.example.com
   ```

3. Start services (already configured under supervisor on this preview environment).
   On first boot the backend auto-seeds MongoDB from `backend/seed_data.py` (idempotent — safe to run repeatedly).

4. Open `/` for the public site and `/admin` for the dashboard.

See **[SETUP.md](./SETUP.md)** for the full setup guide, admin instructions, and how to use Google Drive URLs.
