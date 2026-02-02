# 🗄️ MongoDB Configuration & Setup Guide

## Current Status

✅ **MongoDB is already integrated in the project**
- Connection logic: `server/src/config/database.ts`
- Mongoose ORM configured
- Auto-reconnection logic implemented
- Error handling in place

---

## 📋 How MongoDB is Currently Setup

### Connection File
```typescript
// Location: server/src/config/database.ts

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
    return false;
  }
};

export default connectDB;
```

### Server Integration
```typescript
// Location: server/src/index.ts (Line 17)

import connectDB from './config/database';

// In app initialization:
connectDB();
```

---

## 🚀 MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **"Create an account"**
3. Provide:
   - Email address
   - Password (strong password)
   - Company/Organization name
4. Verify email
5. Complete account setup

### Step 2: Create Free Cluster

1. After login, click **"Create"** → **"Build a Cluster"**
2. Select **"M0 Free"** tier
3. Choose your preferred cloud provider:
   - AWS
   - Google Cloud
   - Azure
4. Select region closest to your location (or default)
5. Click **"Create Cluster"** (Wait ~3-5 minutes)

### Step 3: Create Database User

1. In Atlas Dashboard, go to **"Database Access"** (Left menu)
2. Click **"Add New Database User"**
3. **Authentication Method**: Choose **"Password"**
4. Create username and password:
   ```
   Username: edverse_user
   Password: StrongPassword123!@#
   ```
5. **Database User Privileges**: Select **"Built-in Role"** → **"Atlas Admin"**
6. Click **"Add User"**

### Step 4: Allow IP Whitelist

1. Go to **"Network Access"** (Left menu)
2. Click **"Add IP Address"**
3. Choose one option:
   - **For Development**: `0.0.0.0/0` (Allow from anywhere)
   - **For Production**: Add specific IP addresses
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Clusters"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Select:
   - Driver: **Node.js**
   - Version: **5.x or later**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/edverse?retryWrites=true&w=majority
   ```
5. Replace placeholders:
   ```
   mongodb+srv://edverse_user:StrongPassword123!@#@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority
   ```

---

## 🔧 Environment Configuration

### Step 1: Create .env File

Create `server/.env` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://edverse_user:StrongPassword123!@#@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_chars

# Cloudinary (Optional for development)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Client Configuration
CLIENT_ORIGIN=http://localhost:5173
```

### Step 2: Create client/.env.local

Create `client/.env.local` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000
```

### Step 3: Update .gitignore

Ensure `.env` is in `.gitignore`:

```bash
# Environment variables
.env
.env.local
.env.*.local
```

✅ Already configured in project

---

## 🧪 Testing MongoDB Connection

### Local Testing

**Terminal 1: Start Backend**
```bash
cd server
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
```

**Terminal 2: Check Connection**
```bash
# Install MongoDB CLI (optional)
npm install -g mongosh

# Connect to your MongoDB
mongosh "mongodb+srv://edverse_user:StrongPassword123!@#@cluster0.xxxxx.mongodb.net/edverse"
```

### Using MongoDB Compass

1. Download: [MongoDB Compass](https://www.mongodb.com/products/compass)
2. New Connection
3. Paste connection string:
   ```
   mongodb+srv://edverse_user:StrongPassword123!@#@cluster0.xxxxx.mongodb.net/edverse
   ```
4. Click Connect
5. Browse databases and collections

---

## 📚 Database Collections (Schemas)

### Current Collections in Project

1. **Users**
   - Stores all user accounts (Students, Teachers, Admins, etc.)
   - Fields: email, password, role, profile info

2. **Teachers**
   - Teacher-specific information
   - Auto-generated ID: DEPT-T-YY-SERIAL
   - Auto-generated password from phone number

3. **Students**
   - Student records and enrollment
   - Courses, grades, attendance

4. **Courses**
   - Course information
   - Instructors, schedules, materials

5. **Complaints**
   - User complaints/feedback system

6. **Library**
   - Library management system
   - Books, borrowing records

7. **Others**
   - Blood Donation Registry
   - Cafeteria Management
   - Notifications
   - Analytics data

---

## 🔄 Production MongoDB Setup (Render Deployment)

### In Render Dashboard:

1. Go to: [render.com/dashboard](https://render.com/dashboard)
2. Select your **edverse-server** service
3. Click **Settings** → **Environment**
4. Add/Update:
   ```
   MONGODB_URI = mongodb+srv://edverse_user:StrongPassword123!@#@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority
   ```
5. Click **Save Changes**
6. Service will automatically restart

### MongoDB Atlas - Production Security

1. In Atlas, go to **Network Access**
2. Add Render's IP address range:
   - Get from Render dashboard or
   - Use `0.0.0.0/0` for initial setup
3. Consider restricting in production

---

## ⚠️ Troubleshooting

### Connection Error: "ECONNREFUSED"

**Problem**: MongoDB server not running
```
✗ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
- Ensure MongoDB Atlas cluster is running
- Check IP whitelist allows your IP
- Verify connection string is correct

### Error: "Authentication failed"

**Problem**: Wrong username/password
```
✗ MongoDB connection error: authentication failed
```

**Solution**:
1. Go to MongoDB Atlas
2. Database Access → Find your user
3. Click "Edit" → Reset password
4. Update `.env` with new password

### Error: "MONGODB_URI is not defined"

**Problem**: Environment variable not set
```
✗ MongoDB connection error: MONGODB_URI is not defined
```

**Solution**:
1. Create `server/.env` file
2. Add `MONGODB_URI=mongodb+srv://...`
3. Restart server: `npm run dev`

### Slow Connection

**Problem**: High latency to database
```
Slow query detected
```

**Solution**:
1. Choose closer MongoDB region
2. Optimize database queries
3. Add indexes to frequently queried fields
4. Consider upgrading cluster tier

### IP Whitelist Issues (Production)

**Problem**: "IP not whitelisted"

**Solution**:
1. In MongoDB Atlas → Network Access
2. Add Render's IP address range
3. Or temporarily use `0.0.0.0/0` for debugging

---

## 📊 Database Monitoring

### MongoDB Atlas Monitoring

1. Go to **Metrics** in Atlas dashboard
2. Monitor:
   - Operations per second
   - Network I/O
   - Database connections
   - Storage usage

### Performance Tips

- ✅ Use indexes on frequently queried fields
- ✅ Limit returned fields with projections
- ✅ Use pagination for large result sets
- ✅ Monitor slow queries in logs
- ✅ Clean up old data periodically

---

## 🔐 Security Checklist

- [x] MongoDB connection string has credentials
- [x] `.env` file is in `.gitignore`
- [ ] Production uses strong password (min 16 chars)
- [ ] IP whitelist is restricted (production)
- [ ] Regular backups enabled (Atlas)
- [ ] Two-factor authentication on Atlas account
- [ ] Database encryption at rest (Atlas standard)

---

## 📝 Sample Connection Strings

### Development (Local)
```
mongodb://localhost:27017/edverse
```

### Development (Atlas)
```
mongodb+srv://edverse_user:password@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority
```

### Production (Atlas with Render)
```
mongodb+srv://edverse_user:SecurePassword@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority&ssl=true
```

---

## 🚀 Quick Reference

### Connection Flow

```
Environment Variable (MONGODB_URI)
        ↓
server/src/config/database.ts (connectDB)
        ↓
mongoose.connect()
        ↓
MongoDB Atlas Cluster
        ↓
Connected ✓
```

### Key Files

| File | Purpose |
|------|---------|
| `server/src/config/database.ts` | Database connection logic |
| `server/src/index.ts` | Calls connectDB() on startup |
| `server/.env` | Stores MONGODB_URI (not committed) |
| `.env.example` | Template for environment variables |

---

## 📞 Support Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Community Forum](https://www.mongodb.com/community/forums/)

---

## ✅ Status Check

To verify MongoDB is properly configured:

```bash
# Check if database.ts exists
ls server/src/config/database.ts

# Check if connectDB is called
grep "connectDB" server/src/index.ts

# When running: npm run dev
# Look for: "✓ MongoDB connected successfully"
```

---

*Current Setup: ✅ MongoDB is properly configured*  
*Status: Ready for development and production deployment*  
*Last Updated: February 3, 2026*
