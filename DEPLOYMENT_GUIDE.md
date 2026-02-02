# EdVerse Deployment Guide

## 🚀 Deployment Overview

EdVerse project deployed across two platforms:
- **Backend (API Server)**: Render.com
- **Frontend (React App)**: Vercel

---

## 📋 Pre-Deployment Checklist

- [x] Backend: Build scripts configured
- [x] Frontend: Vite build optimized
- [x] Environment variables documented
- [x] CORS configured
- [x] Database connection ready
- [x] Git repository ready

---

## 🔧 Environment Variables Setup

### Server (.env)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLIENT_URL=https://edverse.vercel.app
CORS_ORIGIN=https://edverse.vercel.app
```

### Client (.env.local)
```
VITE_API_URL=https://edverse-server.onrender.com
```

---

## 📦 Render Deployment (Backend)

### Step 1: Connect Repository
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `edVerse`

### Step 2: Configure Service
- **Name**: `edverse-server`
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Region**: Singapore (or closest to your region)

### Step 3: Add Environment Variables
Click "Add Environment Variable" and add:
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB Atlas connection string
- `JWT_SECRET` = Generate a strong secret key
- `CLOUDINARY_CLOUD_NAME` = Your Cloudinary name
- `CLOUDINARY_API_KEY` = Your API key
- `CLOUDINARY_API_SECRET` = Your API secret
- `EMAIL_USER` = Your Gmail address
- `EMAIL_PASSWORD` = Your Gmail app password
- `CLIENT_URL` = `https://edverse.vercel.app`
- `CORS_ORIGIN` = `https://edverse.vercel.app`

### Step 4: Deploy
- Click "Create Web Service"
- Render will automatically deploy from your main branch
- Service URL: `https://edverse-server.onrender.com`

---

## 🌐 Vercel Deployment (Frontend)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### Step 3: Project Settings
- **Framework**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://edverse-server.onrender.com
```

### Step 5: Deploy
```bash
cd client
vercel
```

Or use Vercel Dashboard automatic deployments from GitHub.

---

## 🔗 API Integration

### Frontend API Configuration
File: `client/src/services/adminService.ts`

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// All API calls use VITE_API_URL environment variable
```

### CORS Settings
Backend automatically configured for:
```
Origin: https://edverse.vercel.app
Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Headers: Content-Type, Authorization
```

---

## 🧪 Testing Deployment

### 1. Test Backend Health
```bash
curl https://edverse-server.onrender.com/api/health
```

### 2. Test Frontend
Visit: `https://edverse.vercel.app`

### 3. Test Authentication
- Login: `admin@edverse.com`
- Password: `admin123`

### 4. Monitor Logs
**Render**: Dashboard → Logs
**Vercel**: Dashboard → Deployments → View Logs

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- View logs: https://dashboard.render.com
- Monitor CPU/Memory usage
- View deployment history

### Vercel Dashboard
- View analytics: https://vercel.com/dashboard
- Monitor page performance
- Check deployment history

---

## 🔄 Continuous Deployment

Both platforms support automatic deployment:

**Render**: Automatically deploys on push to `main` branch
**Vercel**: Automatically deploys on push to `main` branch

To disable auto-deploy:
- Render: Dashboard → Settings → Deploy on Push
- Vercel: Dashboard → Settings → Git

---

## 🚨 Troubleshooting

### Build Fails on Render
1. Check `npm run build` works locally
2. Verify all dependencies are in `package.json`
3. Check environment variables are set
4. View logs: Render Dashboard → Logs

### Build Fails on Vercel
1. Check `cd client && npm run build` works locally
2. Verify Vite configuration
3. Check `.env.local` is configured
4. View logs: Vercel Dashboard → Deployments

### API Connection Issues
1. Verify `VITE_API_URL` is set in Vercel
2. Check CORS is properly configured
3. Verify Render backend is running
4. Test with: `curl https://edverse-server.onrender.com/api/health`

### Database Connection Failed
1. Check MongoDB Atlas IP whitelist includes Render's IP
2. Verify `MONGODB_URI` connection string
3. Test locally with same URI
4. Check MongoDB user permissions

---

## 📝 Deployment Checklist

Before going to production:

- [ ] All environment variables configured on both platforms
- [ ] MongoDB Atlas whitelist includes Render IP
- [ ] CORS properly configured
- [ ] JWT secret is strong and unique
- [ ] Cloudinary credentials verified
- [ ] Email service configured
- [ ] Backend build succeeds: `npm run build`
- [ ] Frontend build succeeds: `npm run build`
- [ ] Admin credentials work: `admin@edverse.com / admin123`
- [ ] All API endpoints responding
- [ ] Error logs checked and clean
- [ ] Performance metrics acceptable

---

## 🎯 Production URLs

Once deployed:
- **Frontend**: https://edverse.vercel.app
- **Backend API**: https://edverse-server.onrender.com
- **Admin Panel**: https://edverse.vercel.app/admin

---

## 📞 Support

For issues:
1. Check Render logs: https://dashboard.render.com
2. Check Vercel logs: https://vercel.com/dashboard
3. Review error messages
4. Check database connectivity
5. Verify environment variables

---

## 🔐 Security Notes

1. **Never commit `.env` files** - Use `.env.example` only
2. **Rotate JWT secret regularly** on production
3. **Enable MongoDB IP whitelist** for production
4. **Use strong email passwords** (Google App Passwords recommended)
5. **Monitor API access logs** regularly
6. **Update dependencies** monthly

---

Last Updated: February 3, 2026
Status: ✅ Ready for Production Deployment
