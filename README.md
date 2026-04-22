# Online Auction System

Full-stack auction platform where sellers create auctions and buyers place real-time bids.

## Features

- User authentication (register/login) with JWT.
- Role-based behavior (`seller`, `buyer`, `admin`).
- Sellers can create auction products.
- Buyers can place bids via REST API and Socket.IO.
- Highest bid is tracked and persisted in MongoDB.
- Winner is the highest bidder when auction ends.

## Tech Stack

- Frontend: React + Vite + Axios + Socket.IO Client
- Backend: Node.js + Express + Socket.IO
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Project Structure

- `auction-backend/` - API server, auth, product and bid logic
- `auction-frontend/` - React frontend

## How Bidding Works

1. User registers/logs in.
2. Seller creates a product auction with `startingBid` and `endTime`.
3. Buyer places a bid.
4. Backend validates: `newBid > currentBid`.
5. If valid:
   - A new `Bid` document is inserted.
   - Product `currentBid` is updated.
   - Product `highestBidder` is updated.
   - Bid history is appended to product `bids`.
6. Live update is broadcast with Socket.IO (`newBid` event).
7. Winner is the highest bidder after auction end.

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB (local server or MongoDB Atlas)

## Environment Variables (Backend)

Create `auction-backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/auctionDB
JWT_SECRET=replace_with_a_secure_secret
PORT=5000
```

If using MongoDB Atlas, set `MONGO_URI` to your Atlas connection string.

## Run Locally

### 1) Start MongoDB

Use one of these methods:

- Windows service (Admin terminal):
  - `net start MongoDB`
- Manual:
  - `mongod --dbpath C:\data\db`

### 2) Start Backend

```bash
cd auction-backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3) Start Frontend

```bash
cd auction-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products` - list auctions
- `GET /api/products/:id` - single auction
- `POST /api/products` - create auction (seller only, token required)

### Bids

- `GET /api/products/:productId/bids` - get all bids for product
- `POST /api/products/:productId/bids` - place bid (token required)

## Socket Events

- Client emits: `joinRoom` with `productId`
- Client emits: `placeBid` with `{ productId, amount }`
- Server emits: `newBid` with latest bid update

## Common Issues

- MongoDB connection failed:
  - Ensure `mongod` is running.
  - Confirm `MONGO_URI` is correct.
  - Prefer `mongodb://127.0.0.1:27017/auctionDB` for local setup.
- `System error 5` on `net start MongoDB`:
  - Run terminal as Administrator.
- CORS issues:
  - Frontend should run on `http://localhost:5173` (configured in backend).

## Future Improvements

- Automatic auction close job and winner finalization endpoint.
- Payment integration for winner checkout.
- Bid increment rules (minimum step amount).
- Unit/integration test coverage.

