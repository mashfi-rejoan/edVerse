# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create a free MongoDB Atlas account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier (512MB storage, perfect for development)

2. **Create a cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0 Sandbox)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Setup Database Access:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Atlas admin" or "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `edverse`

6. **Update server/.env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edverse?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB

### Windows:

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows MSI installer
   - Run installer with default settings

2. **Start MongoDB:**
   ```powershell
   # Start as Windows Service (installed by default)
   net start MongoDB
   
   # Or run manually
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

3. **Verify it's running:**
   ```powershell
   # Open MongoDB shell
   "C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"
   ```

4. **Your connection string (already in .env):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/edverse
   ```

### Linux/Mac:

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Check status
sudo systemctl status mongodb
```

## Troubleshooting

**Error: connect ECONNREFUSED**
- MongoDB is not running
- Check if MongoDB service is started
- Verify the connection string in .env

**Authentication failed**
- Check username/password in connection string
- Ensure database user has proper permissions

**Network timeout (Atlas)**
- Check network access settings in Atlas
- Verify IP address is whitelisted
- Check firewall settings

## After Setup

Restart your backend server:
```bash
npm run dev --workspace server
```

You should see:
```
MongoDB connected successfully
API running on port 4000
```
