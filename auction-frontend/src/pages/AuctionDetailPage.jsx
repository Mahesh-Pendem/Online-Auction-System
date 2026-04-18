import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { money } from "../utils";

export default function AuctionDetailPage({
  token,
  activeProduct,
  bids,
  bidAmount,
  setBidAmount,
  onLoadDetails,
  onJoinRoom,
  onPlaceBid,
  busy
}) {
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    onLoadDetails(id);
    onJoinRoom(id);
  }, [id, onLoadDetails, onJoinRoom]);

  if (!id) return <Navigate to="/auctions" replace />;

  return (
    <section className="panel wide">
      <div className="panel-head">
        <h2>Auction Details</h2>
        <Link className="nav-btn" to="/auctions">
          Back
        </Link>
      </div>
      {!activeProduct ? (
        <p className="muted">Loading auction...</p>
      ) : (
        <>
          <div className="viewer-card">
            <h3>{activeProduct.title}</h3>
            <p>{activeProduct.description || "No description available."}</p>
            <p>Current Highest: {money(activeProduct.currentBid || activeProduct.startingBid)}</p>
          </div>
          <form className="form-inline" onSubmit={(e) => onPlaceBid(e, id)}>
            <input
              type="number"
              min={(activeProduct.currentBid || activeProduct.startingBid || 0) + 1}
              placeholder="Enter your bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
            <button disabled={busy || !token}>{token ? "Place Bid" : "Login First"}</button>
          </form>
          <div className="bids">
            {bids.length === 0 && <p className="muted">No bids yet for this auction.</p>}
            {bids.map((item, idx) => (
              <div className="bid-row" key={item._id || `${item.amount}-${idx}`}>
                <span>{money(item.amount)}</span>
                <small>{new Date(item.createdAt || Date.now()).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
