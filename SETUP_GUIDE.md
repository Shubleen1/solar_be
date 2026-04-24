# ☀️ Solar Referral Backend — Complete Setup Guide
### For Beginners (Step by Step)

---

## What You'll Have After This Guide
- A running Node.js backend on your computer
- A free MongoDB database in the cloud (Atlas)
- All APIs working and tested

---

## STEP 1 — Install Node.js on Your Computer

1. Go to **https://nodejs.org**
2. Click the big green button **"LTS"** (Long Term Support — more stable)
3. Download and install it (keep clicking Next in the installer)
4. Verify it worked — open **Command Prompt** (Windows) or **Terminal** (Mac) and type:
   ```
   node --version
   ```
   You should see something like `v20.11.0` ✅

---

## STEP 2 — Install VS Code (Code Editor)

1. Go to **https://code.visualstudio.com**
2. Download and install it
3. This is where you'll write and view your code

---

## STEP 3 — Create Free MongoDB Atlas Database

MongoDB Atlas is a **free cloud database** — your data lives on the internet, not your computer.

### 3.1 — Create Account
1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"**
3. Sign up with Google or email

### 3.2 — Create a Cluster (your database server)
1. After login, click **"Build a Database"**
2. Choose **"FREE"** (M0 Sandbox) — don't pay anything
3. Choose a cloud provider (AWS is fine) and region closest to India (Mumbai)
4. Click **"Create"**
5. Wait 2–3 minutes for it to set up

### 3.3 — Create a Database User
1. On the left sidebar click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `solaradmin`
   - Password: `solar123` (use something stronger in real life!)
5. Under "Built-in Role" select **"Atlas admin"**
6. Click **"Add User"**

### 3.4 — Allow Your IP Address
1. On the left sidebar click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (easier for development)
   - This adds `0.0.0.0/0` which means anyone can try to connect
   - It's safe because you still need username + password
4. Click **"Confirm"**

### 3.5 — Get Your Connection String
1. On the left sidebar click **"Database"**
2. Click **"Connect"** next to your cluster
3. Click **"Drivers"**
4. Choose Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string — it looks like:
   ```
   mongodb+srv://solaradmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password (`solar123`)
7. Add the database name before the `?`:
   ```
   mongodb+srv://solaradmin:solar123@cluster0.xxxxx.mongodb.net/solar-referral?retryWrites=true&w=majority
   ```
   **Save this string — you'll need it in Step 5**

---

## STEP 4 — Set Up the Project Files

### 4.1 — Open the Project in VS Code
1. Create a folder somewhere on your computer called `solar-backend`
2. Copy all the files from the downloaded zip into this folder
3. In VS Code: File → Open Folder → select `solar-backend`

### 4.2 — Open the Terminal in VS Code
- In VS Code: View → Terminal (or press `Ctrl + backtick`)
- A terminal will open at the bottom

### 4.3 — Install All Dependencies
In the terminal, type this and press Enter:
```bash
npm install
```
This downloads all the packages listed in `package.json`.
You'll see a `node_modules` folder appear. That's normal. ✅

---

## STEP 5 — Create Your .env File

The `.env` file holds your secrets (passwords, keys). Never share this file.

1. In VS Code, right-click the file `.env.example`
2. Click **"Copy"** then **"Paste"**
3. Rename the copy to just `.env` (remove `.example`)
4. Open `.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb+srv://solaradmin:solar123@cluster0.xxxxx.mongodb.net/solar-referral?retryWrites=true&w=majority
JWT_SECRET=mysolarsecretkey2024changethis
FRONTEND_URL=http://localhost:3000
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
COMMISSION_PERCENT=5
```

### For EMAIL_PASS (Gmail App Password):
1. Go to your Google Account → **myaccount.google.com**
2. Click **"Security"**
3. Under "How you sign in to Google", click **"2-Step Verification"** and turn it ON
4. After enabling 2FA, go back to Security
5. Search for **"App passwords"** at the bottom
6. Select App: **"Mail"**, Device: **"Other"** → type "Solar Backend"
7. Click **"Generate"**
8. Copy the 16-character password (like `abcd efgh ijkl mnop`)
9. Remove spaces: `abcdefghijklmnop`
10. Paste into `EMAIL_PASS` in your `.env`

---

## STEP 6 — Start the Server

In the VS Code terminal:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running at http://localhost:5000
```

If you see this — **your backend is working!** 🎉

---

## STEP 7 — Test Your APIs with Postman

Postman lets you test your APIs without a frontend.

### Install Postman
1. Go to **https://www.postman.com/downloads**
2. Download and install it
3. Create a free account

### Test 1: Health Check
- Method: `GET`
- URL: `http://localhost:5000/`
- Click Send
- You should see all routes listed ✅

### Test 2: Register a User (QR scan flow)
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Click **Body** → **raw** → **JSON**
- Paste:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "password": "rahul123"
}
```
- Click Send
- You should get back a token and referral code like `RAHUL-X7K2` ✅

### Test 3: Login
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "rahul@gmail.com",
  "password": "rahul123"
}
```
- Copy the `token` from the response — you'll need it below

### Test 4: Validate a Referral Code
- Method: `GET`
- URL: `http://localhost:5000/api/referral/validate/RAHUL-X7K2`
- No body needed
- You should see `"valid": true` ✅

### Test 5: Submit a Customer Inquiry
- Method: `POST`
- URL: `http://localhost:5000/api/leads/submit`
- Body (JSON):
```json
{
  "customerName": "Amit Kumar",
  "customerPhone": "9999999999",
  "customerCity": "Ludhiana",
  "propertyType": "home",
  "referralCode": "RAHUL-X7K2",
  "message": "Interested in 5kW solar system"
}
```
- You should see `"Inquiry submitted successfully"` ✅

### Test 6: View Dashboard (Protected Route)
- Method: `GET`
- URL: `http://localhost:5000/api/user/dashboard`
- Click **Headers** tab
- Add: Key = `Authorization`, Value = `Bearer YOUR_TOKEN_HERE`
- Click Send ✅

---

## STEP 8 — Create Your First Admin Account

1. Register normally via Postman (Test 2 above) with your real email
2. Then call this API to promote yourself to admin:
   - Method: `POST`
   - URL: `http://localhost:5000/api/admin/make-admin`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body: `{ "email": "your@email.com" }`

Wait — this won't work because you need to be admin to call admin routes!

**First-time fix:** Temporarily comment out `router.use(protect, adminOnly)` in `routes/admin.js`, restart server, make yourself admin, then uncomment it again.

---

## STEP 9 — Generate Your QR Code

Your QR code should point to:
```
http://localhost:5000  ← for testing
https://yourwebsite.com/register  ← for production
```

1. Go to **https://www.qr-code-generator.com**
2. Enter your URL
3. Click Generate
4. Download and print/share it!

When someone scans it → they land on your register page → fill the form → get their referral code.

---

## API Reference Summary

| Method | URL | Who Uses It | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/auth/register` | New user after QR scan | No |
| POST | `/api/auth/login` | Existing user | No |
| GET | `/api/referral/validate/:code` | Customer checking a code | No |
| GET | `/api/referral/my-code` | Logged-in user | Yes |
| POST | `/api/leads/submit` | Customer with referral code | No |
| GET | `/api/user/dashboard` | Logged-in referrer | Yes |
| GET | `/api/admin/stats` | Admin | Yes + Admin |
| GET | `/api/admin/leads` | Admin | Yes + Admin |
| PUT | `/api/admin/leads/:id` | Admin updating status | Yes + Admin |
| PUT | `/api/admin/leads/:id/pay` | Admin paying commission | Yes + Admin |
| GET | `/api/admin/users` | Admin | Yes + Admin |

---

## Folder Structure Explained

```
solar-backend/
├── server.js          ← START HERE. Main file that runs everything
├── .env               ← Your secrets (never share this!)
├── package.json       ← List of all packages used
│
├── config/
│   └── db.js          ← Connects to MongoDB
│
├── models/
│   ├── User.js        ← Structure of a user in database
│   └── Lead.js        ← Structure of a lead (customer inquiry)
│
├── routes/
│   ├── auth.js        ← /api/auth — register, login
│   ├── referral.js    ← /api/referral — get/check codes
│   ├── leads.js       ← /api/leads — submit inquiry
│   ├── user.js        ← /api/user — dashboard
│   └── admin.js       ← /api/admin — manage everything
│
├── middleware/
│   └── auth.js        ← Checks JWT token on protected routes
│
└── utils/
    ├── generateCode.js ← Creates unique referral codes
    └── sendEmail.js    ← Sends emails via Gmail
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module 'express'` | Run `npm install` again |
| `MongoServerError: bad auth` | Check MONGO_URI username/password in .env |
| `ECONNREFUSED` | Make sure you saved .env and restarted server |
| `TokenExpiredError` | Log in again to get a fresh token |
| Email not sending | Check Gmail App Password — must be App Password not regular password |

---

## Next Steps (After Backend Works)

1. ✅ Backend done
2. 🔜 Build React frontend (registration page, dashboard, inquiry form)
3. 🔜 Deploy backend to **Render.com** (free hosting)
4. 🔜 Deploy frontend to **Vercel.com** (free hosting)
5. 🔜 Generate final QR code pointing to live website
6. 🔜 Build React Native mobile app (uses the exact same backend APIs!)
