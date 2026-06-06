# GitHub Setup Guide

How to push this project to GitHub and (optionally) deploy it.

## 1. Confirm `.gitignore` is in place

This repo ships with `.gitignore` files at the root and in `backend/` and
`frontend/`. They ensure `node_modules/` and `.env` files are **never**
committed. Double-check before your first push:

```bash
git status
```

You should **not** see `node_modules/` or any `.env` file listed.

> ⚠️ Never commit your real `.env`. Only the `.env.example` files belong in git.

## 2. Create the repository on GitHub

1. Go to [github.com/new](https://github.com/new).
2. Name it `3W-Social-Post-App`.
3. Leave it **empty** (no README, .gitignore, or license — they already exist locally).
4. Click **Create repository**.

## 3. Push your local code

From the project root:

```bash
git add .
git commit -m "Build full-stack social post app"

# Link the remote (use the URL GitHub showed you)
git remote add origin https://github.com/<your-username>/3W-Social-Post-App.git

git branch -M main
git push -u origin main
```

If the remote already exists, use `git remote set-url origin <url>` instead.

## 4. Deploy (optional)

### Database — MongoDB Atlas
Create a free cluster and copy the connection string (see [QUICK_START.md](QUICK_START.md)).

### Backend — Render
1. New → **Web Service**, connect your GitHub repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.
   (Render sets `PORT` automatically.)

### Frontend — Vercel
1. New Project → import your GitHub repo.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Create React App
4. Add environment variable: `REACT_APP_API_URL` = your Render backend URL
   (e.g. `https://your-app.onrender.com`).
5. Deploy.

## 5. Verify

Open your Vercel URL, sign up, and create a post. If API calls fail, confirm
`REACT_APP_API_URL` points to the live backend and that CORS is enabled
(it is, by default, in `server.js`).
