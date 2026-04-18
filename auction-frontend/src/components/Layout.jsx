import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout({ token, viewer, onLogout, message }) {
  return (
    <div className="page">
      <header className="hero">
        <div className="panel-head">
          <div>
            <h1>NeonBid Marketplace</h1>
            <p>Live auctions with bright vibes and instant bidding.</p>
          </div>
          <div className="nav-meta">
            {token ? <span>{viewer?.name || "User"} ({viewer?.role})</span> : <span>Guest</span>}
            {token ? (
              <button className="ghost" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <Link to="/auth" className="nav-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="nav-bar">
        <NavLink to="/auctions" className={({ isActive }) => (isActive ? "active" : "")}>
          Auctions
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
          Create Auction
        </NavLink>
        <NavLink to="/auth" className={({ isActive }) => (isActive ? "active" : "")}>
          Account
        </NavLink>
      </nav>

      {message && <p className="global-message">{message}</p>}

      <main className="layout">
        <Outlet />
      </main>
    </div>
  );
}
