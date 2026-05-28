# Online Auction System

Full-stack auction platform where sellers create auctions and buyers place bids in real time.

## Project Structure

- `frontend/` - React + Vite client app
- `backend/` - Express + MongoDB API

## Features

- JWT register/login authentication
- Role-based access (`seller`, `buyer`, `admin`)
- Create and browse auctions
- Place bids via REST + optional Socket.IO live updates

## Local Setup

### 1) Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set values in `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 2) Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Free Deployment (Full Stack)

Deploy as two free projects:

### A) Backend on Render (Free Web Service)

1. Push code to GitHub.
2. Create a new Web Service in Render and select this repo.
3. Set Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your frontend URL after deploy)

### B) Frontend on Vercel (Free)

1. Create a Vercel project with Root Directory `frontend`.
2. Add environment variables:
   - `VITE_API_BASE_URL=https://your-render-backend.onrender.com/api`
   - `VITE_SOCKET_URL=https://your-render-backend.onrender.com`
   - `VITE_ENABLE_SOCKET=true`
3. Deploy.

### Alternative: Vercel + Vercel

You can host both on Vercel, but set:

- `VITE_ENABLE_SOCKET=false`

because Vercel serverless does not reliably support persistent Socket.IO connections.
