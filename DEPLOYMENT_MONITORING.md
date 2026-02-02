# 📊 Deployment Dashboard Guide

## 🎯 Purpose

This guide helps you monitor your live deployments and understand what's happening after you push code.

---

## 📱 Dashboard Links

| Platform | Link | Purpose |
|----------|------|---------|
| **Render Backend** | https://dashboard.render.com | Monitor backend deployment |
| **Vercel Frontend** | https://vercel.com/dashboard | Monitor frontend deployment |
| **GitHub Repository** | https://github.com/mashfi-rejoan/edVerse | View code & commits |
| **Live Frontend** | https://edverse.vercel.app | Your live website |
| **Live Admin** | https://edverse.vercel.app/admin | Admin panel |
| **MongoDB Atlas** | https://cloud.mongodb.com | Database monitoring |

---

## 🔴 RENDER DASHBOARD (Backend Monitoring)

### 1. Access Render Dashboard
```
Go to: https://dashboard.render.com
→ Login with your Render account
→ You'll see "edverse-server" service
```

### 2. View Deployment Status

**Current Status Section:**
```
Service: edverse-server
Status: Live (or Building/Deploying)
Last Deploy: Today at 10:30 AM
```

**If Status is:**
- 🟢 **Live** → Backend is running fine
- 🟡 **Building** → Your code is being compiled (2-3 min)
- 🟠 **Deploying** → Being pushed to servers (1 min)
- 🔴 **Failed** → Build error, check logs

### 3. Check Logs (Real-time)

```
Click: "Logs" tab
Shows:
- Server startup messages
- Database connections
- API requests
- Error messages
```

**Good Log:**
```
✓ MongoDB connected successfully
Server running on port 10000
```

**Bad Log:**
```
✗ MongoDB connection error
Application exit code: 1
```

### 4. View Deployments History

```
Click: "Deployments" tab
Shows:
- All deployments made
- Timestamps
- Commit messages
- Build duration
```

**Example:**
```
🟢 Deployment 1 (Today 10:30 AM)
   feat: add new dashboard
   Duration: 2m 15s
   
🟢 Deployment 2 (Today 9:15 AM)
   fix: fix MongoDB connection
   Duration: 2m 10s
```

### 5. Check Metrics (Performance)

```
Click: "Metrics" tab
Shows:
- CPU usage
- Memory usage
- Disk I/O
- Network I/O
```

**Good Metrics:**
- CPU: < 50%
- Memory: < 200MB
- Network: < 100MB/day

### 6. Environment Variables (Setup)

```
Click: "Settings" → "Environment"
Shows all configuration:
- MONGODB_URI (hidden)
- JWT_SECRET (hidden)
- NODE_ENV
- etc.
```

### 7. What to Do If Build Fails

**Error Messages Appear:**
```
Build failed: npm run build error
```

**Steps:**
1. Click "Logs" tab
2. Scroll to see the actual error
3. Note the error message
4. Fix locally
5. Push again

---

## 🔵 VERCEL DASHBOARD (Frontend Monitoring)

### 1. Access Vercel Dashboard
```
Go to: https://vercel.com/dashboard
→ Login with your Vercel account
→ Click "edverse" project
```

### 2. View Deployment Status

**Current Status:**
```
Latest Deployment
Status: Ready (or Building)
URL: https://edverse.vercel.app
```

**Status Meanings:**
- 🟢 **Ready** → Site is live and accessible
- 🟡 **Building** → Code is being compiled (1-2 min)
- 🔴 **Failed** → Build error

### 3. Check Recent Deployments

```
Shows:
- Each deployment
- Status (Ready/Failed)
- Timestamp
- Branch deployed from
- Duration
```

**Example:**
```
🟢 Ready - https://edverse.vercel.app
   feat: add new components
   main branch
   Duration: 1m 32s
   
🟢 Ready - https://edverse.vercel.app
   fix: resolve TypeScript errors
   main branch
   Duration: 1m 45s
```

### 4. View Build Logs

```
Click on a deployment → Click "View Logs"
Shows:
- Download dependencies
- TypeScript compilation
- Vite build process
- Deployment to edge network
```

### 5. Check Analytics

```
Click: "Analytics" tab
Shows:
- Page speed metrics
- Web Vitals (CLS, LCP, FID)
- Traffic patterns
- Error rates
```

### 6. View Environment Variables

```
Click: "Settings" → "Environment Variables"
Shows:
- VITE_API_URL=https://edverse-server.onrender.com
```

### 7. What to Do If Build Fails

**Error Appears:**
```
Build step failed: failed to compile
```

**Steps:**
1. Click "View Logs"
2. Look for error in TypeScript compilation
3. Error will show file and line number
4. Fix locally in that file
5. Test: `npm run build`
6. Commit and push

---

## 📊 MONITORING AFTER YOU PUSH

### Timeline After Push

**Minute 0:** You run `git push origin main`
```
Git receives code
```

**Minute 1:** GitHub webhook triggered
```
Render gets notification
Vercel gets notification
Both start building
```

**Minute 2-3:** Render builds backend
```
Render: "Building..." 
Logs show compilation progress
```

**Minute 1-2:** Vercel builds frontend
```
Vercel: "Building..."
Logs show TypeScript & Vite compilation
```

**Minute 4-5:** Deployments complete
```
Render: "Live ✓"
Vercel: "Ready ✓"
Live site updated!
```

---

## 🧪 HOW TO VERIFY DEPLOYMENT WORKED

### Check #1: Render Backend

```bash
curl https://edverse-server.onrender.com/api/health
```

**Should return:**
```json
{"status":"ok"}
```

**Or visit Render Logs:**
```
Should see: ✓ MongoDB connected successfully
```

### Check #2: Vercel Frontend

```
Open: https://edverse.vercel.app
Should load immediately
```

### Check #3: Test Your Feature

```
Visit: https://edverse.vercel.app
Click on your new feature
Should work as expected
```

### Check #4: Admin Panel

```
Open: https://edverse.vercel.app/admin
Login: admin@edverse.com / admin123
Your feature should be there
```

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue #1: "Building..." for too long (> 5 min)

**Problem:** Deployment stuck in building state

**Solution:**
1. Render: Click "Cancel Deploy" → "Deploy Latest Commit"
2. Vercel: Check logs → look for errors
3. Common cause: Large dependencies
4. Solution: Check `package.json` for unused packages

### Issue #2: "Failed" Status on Render

**Problem:** Backend deployment failed

**Logs show:**
```
✗ Build failed: npm run build error
```

**Solution:**
1. Check build locally: `cd server && npm run build`
2. TypeScript error will show
3. Fix the error
4. Test: `npm run dev`
5. Commit and push

### Issue #3: "Failed" Status on Vercel

**Problem:** Frontend deployment failed

**Logs show:**
```
✗ Build failed: tsc error
```

**Solution:**
1. Check build locally: `cd client && npm run build`
2. Look at error message
3. Fix TypeScript error
4. Test: `npm run dev`
5. Commit and push

### Issue #4: "Ready" but feature not showing

**Problem:** Deployment succeeded but changes not visible

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` (Windows)
2. Clear cache: DevTools → Application → Clear Storage
3. Wait 30 seconds
4. Try different browser

### Issue #5: API returning 404

**Problem:** Frontend can't reach backend API

**Solutions:**
1. Check Render logs - backend might be down
2. Check VITE_API_URL is correct in Vercel
3. Check MongoDB connection in Render
4. Wait for Render to fully start

---

## 📈 REAL-TIME MONITORING SETUP

### Setup Alerts (Optional)

**Render Alerts:**
1. Go to Render Dashboard
2. Click Settings
3. Enable email notifications
4. Get alerts on deployment failures

**Vercel Alerts:**
1. Go to Vercel Dashboard
2. Click Project Settings
3. Enable email notifications
4. Get alerts on deployment status

---

## 🔍 DETAILED LOG READING

### Render Backend Logs Explained

**Good Log Sequence:**
```
[1] Fetching git repository
[2] Building Docker image
[3] Installing dependencies... npm install
[4] Running build command... npm run build
[5] Successfully compiled with tsc
[6] Starting service
[7] Server running on port 10000
[8] ✓ MongoDB connected successfully
[9] ✓ All routes registered
```

**Bad Log Sequence:**
```
[1] Fetching git repository
[2] Building Docker image
[3] Installing dependencies... npm install
[4] Running build command... npm run build
[5] ✗ Error: Cannot find module 'xyz'
[6] Build failed
[7] Service exited with code 1
```

### Vercel Frontend Logs Explained

**Good Log Sequence:**
```
[1] Vercel CLI 26.5.4
[2] Downloading project files
[3] Installing dependencies
[4] Running build command: tsc -b && vite build
[5] 1230 modules transformed
[6] Building for production
[7] ✓ built in 5.23s
[8] Uploading build files
[9] Deployment complete!
```

**Bad Log Sequence:**
```
[1] Running build command: tsc -b && vite build
[2] client/src/App.tsx:10:5 - error TS2304
[3] Cannot find name 'React'
[4] Build failed
```

---

## 📋 DEPLOYMENT CHECKLIST

After pushing code, verify:

- [ ] GitHub shows your commit
- [ ] Render: Shows "Building" status
- [ ] Vercel: Shows "Building" status
- [ ] Wait 5-10 minutes
- [ ] Render: Shows "Live ✓" status
- [ ] Vercel: Shows "Ready ✓" status
- [ ] Visit https://edverse.vercel.app
- [ ] Feature works as expected
- [ ] Admin panel still works
- [ ] No console errors (F12)

---

## 🎯 QUICK REFERENCE

| Situation | Action |
|-----------|--------|
| Build taking long | Wait or check logs |
| Build failed | Check logs, fix locally, push again |
| Deployment shows "Ready" but feature not visible | Hard refresh (Ctrl+Shift+R) |
| API not responding | Check Render logs & MongoDB |
| Everything looks good | Check live site one more time! |

---

## 📞 EMERGENCY PROCEDURES

### If Backend is Down

**Quick Check:**
```bash
curl https://edverse-server.onrender.com/api/health
# If no response, backend is down
```

**Fix:**
1. Go to Render Dashboard
2. Click "edverse-server"
3. Click "Manual Deploy" → "Deploy Latest Commit"
4. Wait 3 minutes
5. Test with curl again

### If Frontend is Down

**Quick Check:**
```
Open: https://edverse.vercel.app
# Should load in < 2 seconds
```

**Fix:**
1. Go to Vercel Dashboard
2. Go to Deployments
3. Click on a previous "Ready" deployment
4. Click "Rollback to this Deployment"
5. Or push new code to trigger rebuild

---

## 📚 RESOURCES

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- MongoDB Docs: https://docs.mongodb.com

---

*Last Updated: February 3, 2026*  
*Status: ✅ Live Monitoring Ready*
