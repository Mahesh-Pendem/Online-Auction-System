import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../utils";

export default function AuctionsPage({ products, onRefresh }) {
  const navigate = useNavigate();

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <section className="panel wide">
      <div className="panel-head">
        <h2>All Auctions</h2>
        <button className="ghost" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      <div className="grid">
        {products.length === 0 && <p className="muted">No auctions yet.</p>}
        {products.map((item) => (
          <article className="auction-card" key={item._id} onClick={() => navigate(`/auctions/${item._id}`)}>
            <h3>{item.title}</h3>
            <p>{item.description || "No description added."}</p>
            <div className="meta">
              <span>Current: {money(item.currentBid || item.startingBid)}</span>
              <span>Ends: {new Date(item.endTime).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
