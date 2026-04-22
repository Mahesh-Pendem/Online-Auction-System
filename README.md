# 🛒 Online Auction System

Full-stack auction platform where sellers create auctions and buyers place real-time bids.

---

## 🚀 Features

* 🔐 User authentication (register/login) using JWT
* 👥 Role-based behavior (seller, buyer, admin)
* 🛍️ Sellers can create auction products
* 💰 Buyers can place bids via REST API and Socket.IO
* 📊 Highest bid is tracked and stored in MongoDB
* 🏆 Winner is the highest bidder when auction ends

---

## 🛠️ Tech Stack

* 🎨 Frontend: React + Vite + Axios + Socket.IO Client
* ⚙️ Backend: Node.js + Express + Socket.IO
* 🗄️ Database: MongoDB + Mongoose
* 🔑 Authentication: JWT + bcrypt

---

## 📁 Project Structure

* `auction-backend/` → API server, authentication, product & bid logic
* `auction-frontend/` → React frontend

---

## 🧠 How Bidding Works

1. 👤 User registers or logs in

2. 🛍️ Seller creates an auction with `startingBid` and `endTime`

3. 💸 Buyer places a bid

4. ⚙️ Backend validates: `newBid > currentBid`

5. ✅ If valid:

   * New Bid document is created
   * Product `currentBid` is updated
   * Product `highestBidder` is updated
   * Bid history is stored
   * 📡 Live update sent using Socket.IO (`newBid` event)

6. 🏁 Winner is the highest bidder after auction ends

---

## 📦 Prerequisites

* Node.js (v18+ recommended)
* npm
* MongoDB (local server or MongoDB Atlas)

---

## ▶️ Run Locally

### 1️⃣ Start MongoDB

**Option 1 (Windows Service):**

```bash
net start MongoDB
```

**Option 2 (Manual):**

```bash
mongod --dbpath C:\data\db
```

---

### 2️⃣ Start Backend

```bash
cd auction-backend
npm install
npm run dev
```

🌐 Backend runs at: http://localhost:5000

---

### 3️⃣ Start Frontend

```bash
cd auction-frontend
npm install
npm run dev
```

🌐 Frontend runs at: http://localhost:5173

---

## 📡 API Endpoints

### 🔐 Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

---

### 🛍️ Products

* GET `/api/products` → list all auctions
* GET `/api/products/:id` → get single auction
* POST `/api/products` → create auction (seller only)

---

### 💰 Bids

* GET `/api/products/:productId/bids` → get all bids
* POST `/api/products/:productId/bids` → place bid

---

## 🔌 Socket Events

* 📥 Client emits: `joinRoom` with `productId`
* 📤 Client emits: `placeBid` with `{ productId, amount }`
* 📡 Server emits: `newBid` with latest bid update

---

## 🔮 Future Improvements

* ⏳ Automatic auction closing system
* 💳 Payment integration for winners
* 📈 Minimum bid increment rules
* 🧪 Unit and integration testing

---

## 👨‍💻 Author

Mahesh Pendem
