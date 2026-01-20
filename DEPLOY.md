# Deployment Guide (Render + Vercel)

## Backend (Render)
1. Push code to GitHub (branch: `main`).
2. Create a new Web Service in Render:
   - Repository: this repo
   - Root Directory: repo root (default)
   - Build Command: `npm install && npm run build --workspace server`
   - Start Command: `npm run start --workspace server`
   - Health Check Path: `/api/health`
   - Auto Deploy: enabled
3. Environment Variables (Render):
   - `PORT=4000`
   - `MONGODB_URI=<your mongodb uri>`
   - `JWT_ACCESS_SECRET=<strong random string>`
   - `JWT_REFRESH_SECRET=<strong random string>`
   - `CLIENT_ORIGIN=https://<your-vercel-app>.vercel.app` (comma-separate multiple origins if needed)
4. Optionally, connect using `render.yaml` at repo root for auto-detection.

## Frontend (Vercel)
1. Import this GitHub repo into Vercel.
2. Set **Root Directory** to `client`.
3. Build settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables (Vercel):
   - `VITE_API_URL=https://<your-render-backend>.onrender.com/api`
5. Redeploy after saving env variables.

## CORS and Origins
- Backend allows only origins defined in `CLIENT_ORIGIN` (comma-separated). Include both dev and prod if you need local testing, e.g. `http://localhost:5173,https://<your-vercel-app>.vercel.app`.

## Quick Verification
- Hit `https://<your-render-backend>.onrender.com/api/health` to confirm backend up.
- From frontend, register/login and check network calls reach the Render domain.
- If CORS errors appear, confirm `CLIENT_ORIGIN` includes the Vercel domain.
