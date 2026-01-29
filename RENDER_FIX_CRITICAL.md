# 🔴 RENDER DEPLOYMENT FIX - CRITICAL

## Problem
Backend deploy on Render fails with:
```
Error: Cannot find module '/opt/render/project/src/server/dist/index.js'
```

Build says "successful" but `dist/index.js` doesn't exist.

## Root Cause
**Render is NOT running the TypeScript build command** even though it says build was successful.

The build command is not properly configured in the Render dashboard.

## Solution - UPDATE RENDER DASHBOARD IMMEDIATELY

### In Render.com Dashboard for your edverse-api service:

**1. Build Command** (must be EXACTLY this):
```
npm install && npm run build
```

**2. Start Command** (must be EXACTLY this):
```
npm start
```

**3. Root Directory** (must be EXACTLY this):
```
server
```

**4. Environment Variables** (add all of these):
- `PORT` = `4000`
- `MONGODB_URI` = `<your-mongodb-connection-string>`
- `JWT_ACCESS_SECRET` = `<generate-a-random-string>`
- `JWT_REFRESH_SECRET` = `<generate-a-random-string>`
- `CLIENT_ORIGIN` = `http://localhost:5173` (for local) OR your Vercel URL (for production)

## Step by Step in Render Dashboard

1. Go to Render.com dashboard
2. Click on your `edverse-api` service
3. Click "Settings" tab
4. Scroll to "Build & Deploy" section
5. **Build Command:** Clear and enter: `npm install && npm run build`
6. **Start Command:** Clear and enter: `npm start`
7. **Root Directory:** Clear and enter: `server`
8. Click "Save" at bottom
9. Go back to "Deploys" tab
10. Click "New Deploy" to trigger a fresh deployment

## Expected Build Log After Fix

```
==> Build started
==> Building...
> npm install
... installs packages ...
> npm run build
tsc -p tsconfig.json
... TypeScript compilation ...
==> Build successful 🎉
==> Deploying...
> npm start
Server running on port 4000
```

## Verification After Deploy

Once it's green/live:
- Try accessing: `https://your-render-service-url/api/health`
- Should return a response (not 404)

## If Still Failing

Check Render logs for:
- TypeScript compilation errors
- Missing environment variables
- MongoDB connection issues

If you see `Cannot find module`, it means:
- Build command didn't run (check Build Command in dashboard)
- TypeScript didn't compile (check tsconfig.json)
- dist/ folder wasn't created (check tsc output)

---

**DO THIS NOW:**
1. Open Render dashboard
2. Update all 3 settings above
3. Click "Save"
4. Trigger "New Deploy"
5. Watch logs until it says "Live"

Once Render is ✅ working, we'll deploy Vercel frontend.
