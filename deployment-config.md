# 🚀 MENACE 2 SOCIETY — DEPLOYMENT GUIDE

## Complete Production Deployment Setup

---

## 📋 TABLE OF CONTENTS

1. [Firebase Setup](#1-firebase-setup)
2. [Backend Deployment (Render)](#2-backend-deployment-render)
3. [Frontend Deployment (Vercel)](#3-frontend-deployment-vercel)
4. [Environment Variables](#4-environment-variables)
5. [Database Initialization](#5-database-initialization)
6. [Post-Deployment Checklist](#6-post-deployment-checklist)

---

## 1. FIREBASE SETUP

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://firebase.google.com)
2. Click "Create a project"
3. Name: `menace-2-society`
4. Enable Google Analytics
5. Click "Create project"

### Step 2: Set Up Authentication
1. Go to Authentication (left sidebar)
2. Click "Get started"
3. Enable providers:
   - Email/Password
   - Google
   - Save

### Step 3: Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select region: `us-central1`
5. Click "Create"

### Step 4: Set Up Storage
1. Go to Storage
2. Click "Get started"
3. Keep default settings
4. Click "Done"

### Step 5: Get Firebase Config
1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", create a Web app
3. Copy the config object
4. Use this for `REACT_APP_FIREBASE_*` variables

### Step 6: Generate Admin SDK Key
1. Go to Service Accounts (in Project Settings)
2. Click "Generate new private key"
3. Copy JSON content
4. Use for `FIREBASE_ADMIN_KEY` in backend

---

## 2. BACKEND DEPLOYMENT (RENDER)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configuration:
   - Name: `menace-backend`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `node backend-server.js`
   - Instance type: `Free` (or upgrade to Standard)

### Step 3: Add Environment Variables
1. In Render dashboard, go to Environment
2. Add all variables from `.env`:
   ```
   PORT=5000
   NODE_ENV=production
   FIREBASE_ADMIN_KEY=...
   STRIPE_SECRET_KEY=...
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...
   ```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note the URL: `https://menace-backend.onrender.com`

### Step 5: Test Backend
```bash
curl https://menace-backend.onrender.com/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 3. FRONTEND DEPLOYMENT (VERCEL)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click "New Project"
2. Select your GitHub repository
3. Click "Import"

### Step 3: Configure Project
1. Framework: `React`
2. Build command: `npm run build`
3. Output directory: `build`

### Step 4: Add Environment Variables
1. Go to Settings → Environment Variables
2. Add all `REACT_APP_*` variables:
   ```
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   REACT_APP_FIREBASE_MEASUREMENT_ID=...
   REACT_APP_STRIPE_PUBLISHABLE_KEY=...
   REACT_APP_BACKEND_URL=https://menace-backend.onrender.com
   ```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app is live at: `https://damenace.vercel.app`

---

## 4. ENVIRONMENT VARIABLES

### Firebase `.env` Example:
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=menace-2-society.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=menace-2-society
REACT_APP_FIREBASE_STORAGE_BUCKET=menace-2-society.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEF12345
```

### Stripe Example:
```env
# Get from https://dashboard.stripe.com/apikeys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_abc123...
STRIPE_SECRET_KEY=sk_test_abc123...
```

### Gmail App Password:
1. Go to [Google Account](https://myaccount.google.com)
2. Security → App passwords
3. Generate app password
4. Use as `EMAIL_PASSWORD`

---

## 5. DATABASE INITIALIZATION

### Create Firestore Collections (automatic via code):
- `users` - User profiles
- `products` - Product catalog
- `orders` - Order history
- `comics` - Comic metadata
- `notifications` - User notifications
- `scheduledDrops` - Scheduled releases

### Seed Sample Data:
1. Run admin script or use Firebase Console
2. Add sample products, comics, characters
3. Verify in Firestore

---

## 6. POST-DEPLOYMENT CHECKLIST

- [ ] Firebase project created and configured
- [ ] Firestore database initialized
- [ ] Storage enabled
- [ ] Authentication providers enabled
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set in both
- [ ] Backend API responding to requests
- [ ] Frontend connecting to backend
- [ ] Firebase auth working (login/signup)
- [ ] Stripe payment testing working
- [ ] Email notifications functional
- [ ] Admin dashboard accessible
- [ ] Products displaying
- [ ] Shopping cart working
- [ ] Orders persisting

---

## PRODUCTION DOMAINS

### Development:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Production:
- Frontend: `https://damenace.vercel.app`
- Backend: `https://menace-backend.onrender.com`

---

## TROUBLESHOOTING

### Backend not connecting:
```bash
# Test from Vercel Functions
curl https://menace-backend.onrender.com/api/health
```

### Firebase auth errors:
- Check API key is correct
- Verify domain is authorized in Firebase
- Check authentication providers enabled

### Payment not working:
- Verify Stripe keys are correct
- Test with Stripe test card: 4242 4242 4242 4242
- Check webhook configuration

### CORS errors:
- Add frontend URL to backend CORS settings
- Verify backend `FRONTEND_URL` env var

---

## COSTS

### Firebase (Free Tier):
- Users: Unlimited
- Firestore: 1GB storage, 50k reads/day
- Storage: 1GB

### Render (Free Tier):
- Web Service: Hibernates after 15 min inactivity

### Vercel (Free Tier):
- Unlimited deployments
- 100GB bandwidth
- Serverless functions

**Total: $0/month to start** 🎉

---

## NEXT STEPS

1. Test all functionality in production
2. Set up analytics (Firebase Analytics)
3. Configure email templates
4. Set up automated backups
5. Monitor error logs (Sentry)
6. Prepare launch marketing

