import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { apiFetch, createSocket, parseJwt } from "./api";
import Layout from "./components/Layout";
import AuctionsPage from "./pages/AuctionsPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import AuthPage from "./pages/AuthPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";

const defaultAuction = { title: "", description: "", startingBid: "", endTime: "" };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("auction_token") || "");
  const [viewer, setViewer] = useState(parseJwt(localStorage.getItem("auction_token") || ""));
  const [auctionForm, setAuctionForm] = useState(defaultAuction);
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const roomRef = useRef("");

  const loadProducts = useCallback(async () => {
    try {
      const list = await apiFetch("/products");
      setProducts(list);
    } catch (err) {
      setMessage(err.message);
    }
  }, []);

  const loadDetails = useCallback(async (productId) => {
    try {
      const [product, bidList] = await Promise.all([
        apiFetch(`/products/${productId}`),
        apiFetch(`/products/${productId}/bids`).catch(() => [])
      ]);
      setActiveProduct(product);
      setBids(bidList);
    } catch (err) {
      setMessage(err.message);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem("auction_token", token);
    setViewer(parseJwt(token));
    if (socketRef.current) socketRef.current.disconnect();
    const socket = createSocket(token);
    socketRef.current = socket;
    socket.on("newBid", (incomingBid) => {
      const amount = Number(incomingBid?.amount || 0);
      if (!amount || !roomRef.current) return;
      setBids((prev) => [incomingBid, ...prev]);
      setProducts((prev) =>
        prev.map((item) =>
          item._id === roomRef.current ? { ...item, currentBid: amount } : item
        )
      );
      setActiveProduct((prev) => (prev ? { ...prev, currentBid: amount } : prev));
      setMessage("A new live bid just arrived!");
    });
  }, [token]);

  useEffect(() => {
    if (token) return;
    localStorage.removeItem("auction_token");
    setViewer(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [token]);

  async function handleLogin(payload) {
    setBusy(true);
    setMessage("");
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: payload });
      setToken(data.token);
      setMessage("Logged in successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(payload) {
    setBusy(true);
    setMessage("");
    try {
      await apiFetch("/auth/register", { method: "POST", body: payload });
      setMessage("Registration successful. Please login.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateAuction(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await apiFetch(
        "/products",
        { method: "POST", body: { ...auctionForm, startingBid: Number(auctionForm.startingBid) } },
        token
      );
      setAuctionForm(defaultAuction);
      setMessage("Auction created!");
      await loadProducts();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  function joinRoom(productId) {
    roomRef.current = productId;
    if (socketRef.current) socketRef.current.emit("joinRoom", productId);
  }

  async function handlePlaceBid(e, productId) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const amount = Number(bidAmount);
    try {
      if (socketRef.current) {
        await new Promise((resolve, reject) => {
          socketRef.current.emit("placeBid", { productId, amount }, (resp) => {
            if (resp?.success) resolve(resp);
            else reject(new Error(resp?.message || "Bid failed"));
          });
        });
      } else {
        await apiFetch(`/products/${productId}/bids`, { method: "POST", body: { amount } }, token);
      }
      setBidAmount("");
      setMessage("Bid submitted!");
      await Promise.all([loadProducts(), loadDetails(productId)]);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              token={token}
              viewer={viewer}
              onLogout={() => setToken("")}
              message={message}
            />
          }
        >
          <Route index element={<Navigate to="/auctions" replace />} />
          <Route path="auth" element={<AuthPage token={token} onLogin={handleLogin} onRegister={handleRegister} busy={busy} />} />
          <Route path="auctions" element={<AuctionsPage products={products} onRefresh={loadProducts} />} />
          <Route
            path="auctions/:id"
            element={
              <AuctionDetailPage
                token={token}
                activeProduct={activeProduct}
                bids={bids}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                onLoadDetails={loadDetails}
                onJoinRoom={joinRoom}
                onPlaceBid={handlePlaceBid}
                busy={busy}
              />
            }
          />
          <Route
            path="create"
            element={
              <CreateAuctionPage
                token={token}
                viewer={viewer}
                form={auctionForm}
                setForm={setAuctionForm}
                onCreate={handleCreateAuction}
                busy={busy}
              />
            }
          />
          <Route path="*" element={<Navigate to="/auctions" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
