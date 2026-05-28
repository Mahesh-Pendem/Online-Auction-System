import { Navigate } from "react-router-dom";

export default function CreateAuctionPage({
  token,
  viewer,
  form,
  setForm,
  onCreate,
  busy
}) {
  const canSell = viewer?.role === "seller" || viewer?.role === "admin";

  if (!token) return <Navigate to="/auth" replace />;

  return (
    <section className="panel">
      <h2>Create Auction</h2>
      {!canSell ? (
        <p className="muted">Only seller/admin can create auctions.</p>
      ) : (
        <form className="form" onSubmit={onCreate}>
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            min="1"
            placeholder="Starting bid"
            required
            value={form.startingBid}
            onChange={(e) => setForm({ ...form, startingBid: e.target.value })}
          />
          <input
            type="datetime-local"
            required
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
          <button disabled={busy}>{busy ? "Creating..." : "Create Auction"}</button>
        </form>
      )}
    </section>
  );
}
