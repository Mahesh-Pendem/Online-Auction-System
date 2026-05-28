# Online Auction System

Full-stack auction platform with a colorful gradient UI. Sellers create auctions; buyers place bids in real time.

## Project Structure

- `frontend/` — React + Vite (deploy on **Vercel**)
- `backend/` — Express + MongoDB + Socket.IO (deploy on **Render**)

## Local Development

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

`backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Build

```bash
cd backend && npm install
cd ../frontend && npm install && npm run build
```

## Deploy (Free)

### 1) MongoDB Atlas (free)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow access from anywhere (`0.0.0.0/0`) for development.
3. Copy the connection string into `MONGO_URI`.

### 2) Backend on Render (free)

1. Push this repo to GitHub.
2. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** (or Web Service).
3. Connect the repo; set **Root Directory** to `backend`.
4. **Build Command:** `npm install`  
   **Start Command:** `npm start`
5. Environment variables:
   - `MONGO_URI` — Atlas connection string
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — your Vercel URL (add after step 3)
6. Deploy and copy the URL, e.g. `https://online-auction-api.onrender.com`.

Or use the included `render.yaml` at repo root for a Blueprint deploy.

### 3) Frontend on Vercel (free)

1. [vercel.com](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. **Root Directory:** `frontend`
3. Environment variables:

```env
VITE_API_BASE_URL=https://YOUR-RENDER-URL.onrender.com/api
VITE_SOCKET_URL=https://YOUR-RENDER-URL.onrender.com
VITE_ENABLE_SOCKET=true
```

4. Deploy.

### 4) Finish CORS

In Render, set `FRONTEND_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`) and redeploy the backend.

## API

- `POST /api/auth/register` · `POST /api/auth/login`
- `GET /api/products` · `GET /api/products/:id` · `POST /api/products`
- `GET|POST /api/products/:productId/bids`
