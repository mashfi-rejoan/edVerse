# Registration Debugging Guide

## Issue: "Registration failed. Please try again."

If you're seeing this error when trying to register, follow these debugging steps:

## Step 1: Check Browser Console

1. Open http://localhost:5173 in your browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to register again
5. Look for any error messages - they will tell you what went wrong

**Common errors you might see:**

```
API Error: {
  status: 409,
  data: { message: "User with this email or university ID already exists" },
  message: "Request failed with status code 409"
}
```
**Solution:** Use a different email or university ID

```
API Error: {
  status: 400,
  data: { message: "Please provide all required fields" },
  message: "Request failed with status code 400"
}
```
**Solution:** Make sure all fields are filled:
- Name
- Email (valid format: name@domain.com)
- University ID (must be unique)
- Password (at least 6 characters)
- Role (Student or Teacher)

## Step 2: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try to register again
4. Look for a request to `http://localhost:4000/api/auth/register`
5. Click on it to see:
   - **Request**: Body should have your form data
   - **Response**: Should show the error message from server

**If no request appears:**
- Backend might not be running
- API URL might be wrong
- CORS might be blocked

## Step 3: Verify Backend is Running

Open a new terminal and run:
```bash
# Test the health endpoint
curl http://localhost:4000/health

# Or in PowerShell:
Invoke-WebRequest http://localhost:4000/health
```

You should see:
```json
{"status":"ok"}
```

**If this fails:**
- Backend is not running
- Start it with: `npm run dev --workspace server`

## Step 4: Check MongoDB Connection

In the backend terminal window, you should see:
```
✓ API running on http://localhost:4000
✓ MongoDB connected successfully
```

**If you see MongoDB connection error:**
- Check your .env file has the correct MONGODB_URI
- Verify the MongoDB Atlas cluster is online
- Check that network access is allowed in MongoDB Atlas settings

## Step 5: Manual API Test

### Using PowerShell:
```powershell
$body = @{
    name="John Doe"
    email="john@university.edu"
    universityId="20245103183"
    password="password123"
    role="student"
    bloodGroup="O+"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Expected Response (Success):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@university.edu",
    "universityId": "20245103183",
    "role": "student"
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

### Expected Response (Error):
```json
{
  "message": "User with this email or university ID already exists"
}
```

## Step 6: Check Frontend Logs

The frontend logs registration attempts to console. In browser DevTools Console, look for:

```
Attempting to register with: {name: "...", email: "...", ...}
Registration successful: {id: "...", name: "...", ...}
```

Or error:
```
Registration failed: Error: Request failed with status code 400
```

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/register"
**Cause:** Backend is not recognizing the route
**Solution:** 
- Restart backend: `npm run dev --workspace server`
- Check that [server/src/routes/auth.ts](../server/src/routes/auth.ts) exists
- Verify routes are imported in [server/src/index.ts](../server/src/index.ts)

### Issue: Network Error / CORS Error
**Cause:** Frontend can't reach backend
**Solution:**
- Ensure backend is running on port 4000
- Check `.env.local` has: `VITE_API_URL=http://localhost:4000/api`
- Verify CORS is enabled: `app.use(cors({ origin: true, credentials: true }))`

### Issue: 409 Conflict Error (User already exists)
**Cause:** Email or University ID already registered
**Solution:**
- Use a different email
- Use a different University ID
- Or delete from MongoDB if testing

### Issue: Blank error message
**Cause:** Unexpected server error
**Solution:**
- Check server console for errors
- Look at backend logs in terminal
- Try curl command to see actual error response

## Troubleshooting Checklist

- [ ] Backend running on port 4000?
- [ ] MongoDB connected successfully?
- [ ] Frontend running on port 5173?
- [ ] All form fields filled in?
- [ ] Browser console shows no errors?
- [ ] Network tab shows successful request?
- [ ] Response status is 201 (Created)?
- [ ] Email is unique (not already registered)?
- [ ] University ID is unique?

## Still Having Issues?

1. **Stop all terminals** (Ctrl+C)
2. **Clear browser cache** (F12 → Application → Clear Storage)
3. **Restart everything:**
   ```bash
   npm run dev --workspace server
   npm run dev --workspace client
   ```
4. **Try fresh registration** with new email and ID
5. **Check browser console** (F12 → Console tab) for detailed errors
6. **Share the error message** from console

## Debug Commands

Test backend is responsive:
```bash
# PowerShell
Invoke-WebRequest http://localhost:4000/health
```

Test database connection:
Check MongoDB Atlas dashboard to verify cluster is running

Test API endpoint directly:
```bash
# From another terminal while server is running
$body = @{name="Test"; email="test@test.com"; universityId="TEST"; password="pass123"; role="student"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register" -Method POST -ContentType "application/json" -Body $body
```
