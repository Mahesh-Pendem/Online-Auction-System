import { useState } from "react";
import { Navigate } from "react-router-dom";

const defaultAuth = { name: "", email: "", password: "", role: "buyer" };

export default function AuthPage({ token, onLogin, onRegister, busy }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState(defaultAuth);

  if (token) return <Navigate to="/auctions" replace />;

  async function submit(e) {
    e.preventDefault();
    if (tab === "register") {
      await onRegister(form);
      setTab("login");
    } else {
      await onLogin({ email: form.email, password: form.password });
    }
    setForm(defaultAuth);
  }

  return (
    <section className="panel">
      <h2>Account Access</h2>
      <div className="tabs">
        <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>
          Login
        </button>
        <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>
          Register
        </button>
      </div>
      <form className="form" onSubmit={submit}>
        {tab === "register" && (
          <>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button disabled={busy}>{busy ? "Please wait..." : tab === "login" ? "Login" : "Register"}</button>
      </form>
    </section>
  );
}
