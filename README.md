# 3W Social Post App

A full-stack social media application where users can sign up, create posts (text and/or images), like posts, and comment. Built with React + Material UI on the frontend and Node.js/Express + MongoDB on the backend.

## ✨ Features

- **Authentication** — JWT-based signup & login with bcrypt password hashing
- **Posts** — create posts with text, an image (Base64), or both
- **Feed** — paginated feed (10 posts per page), newest first
- **Likes** — like / unlike any post with instant UI updates
- **Comments** — comment on posts and delete your own comments
- **Responsive UI** — Material UI components, mobile and desktop friendly

## 🧱 Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | React 18, Material UI 5, React Router v6, Axios          |
| Backend  | Node.js, Express 4, Mongoose 7, JWT, bcryptjs           |
| Database | MongoDB (collections: `users`, `posts`)                 |

## 📁 Project Structure

```
3W-Social-Post-App/
├── backend/          # Express API
│   ├── models/       # Mongoose models (User, Post)
│   ├── routes/       # auth, posts, users
│   ├── middleware/   # JWT auth middleware
│   └── server.js     # App entry point
└── frontend/         # React app
    └── src/
        ├── pages/        # Login, Signup, Feed
        ├── components/   # Navbar, CreatePost, PostCard
        ├── api.js        # Axios instance with auth interceptor
        └── App.js        # Routing + theme
```

## 🚀 Getting Started

See [QUICK_START.md](QUICK_START.md) for step-by-step setup instructions.

### Prerequisites

- Node.js 16+ and npm
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your values
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # optional; defaults to the dev proxy
npm start                 # starts on http://localhost:3000
```

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)

| Method | Endpoint   | Auth | Body                                          |
|--------|------------|------|-----------------------------------------------|
| POST   | `/signup`  | No   | `username, email, password, passwordConfirm`  |
| POST   | `/login`   | No   | `email, password`                             |
| GET    | `/me`      | Yes  | —                                             |

### Posts (`/posts`)

| Method | Endpoint                         | Auth | Notes                          |
|--------|----------------------------------|------|--------------------------------|
| POST   | `/create`                        | Yes  | `text` and/or `image` (Base64) |
| GET    | `/feed?page=1`                   | No   | 10 per page, newest first      |
| GET    | `/:id`                           | No   | Single post                    |
| POST   | `/:id/like`                      | Yes  | Toggle like                    |
| POST   | `/:id/comment`                   | Yes  | `text`                         |
| DELETE | `/:postId/comment/:commentId`    | Yes  | Author only                    |

### Users (`/users`)

| Method | Endpoint                | Auth | Notes               |
|--------|-------------------------|------|---------------------|
| GET    | `/:id`                  | No   | User by id          |
| GET    | `/username/:username`   | No   | User by username    |

Authenticated requests must include the header:

```
Authorization: Bearer <token>
```

## 🌐 Deployment

- **Frontend** → Vercel (set `REACT_APP_API_URL` to your backend URL)
- **Backend** → Render (set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`)
- **Database** → MongoDB Atlas

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for pushing the repo to GitHub.

## 📄 License

ISC — built for the 3W Business internship assignment.
