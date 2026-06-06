# Quick Start Guide

Get the Social Post App running locally in about 5 minutes.

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 16 or newer (includes npm)
- A MongoDB database. The easiest option is a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

## 2. Get a MongoDB connection string

1. Create a free cluster on MongoDB Atlas.
2. Create a database user (username + password).
3. Under **Network Access**, allow your IP (or `0.0.0.0/0` for development).
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/social_app
   ```

## 3. Start the backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Edit `backend/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/social_app
JWT_SECRET=pick-a-long-random-secret
PORT=5000
NODE_ENV=development
```

Run it:

```bash
npm run dev
```

You should see `Connected to MongoDB` and `Server running on port 5000`.

## 4. Start the frontend

In a **new terminal**:

```bash
cd frontend
npm install
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000). The frontend
proxies API calls to the backend on port 5000 automatically (configured via the
`proxy` field in `frontend/package.json`).

> Setting `frontend/.env` is optional for local dev. It only matters in
> production, where you set `REACT_APP_API_URL` to your deployed backend URL.

## 5. Try it out

1. Click **Sign up** and create an account.
2. Create a post with text and/or an image.
3. Like and comment on posts.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connection error` | Check `MONGODB_URI` and that your IP is allowed in Atlas. |
| Frontend can't reach API | Make sure the backend is running on port 5000. |
| `Port 5000 already in use` | Change `PORT` in `backend/.env` (and update the proxy / `REACT_APP_API_URL`). |
| Image upload fails | Images must be under 2MB (stored as Base64). |
