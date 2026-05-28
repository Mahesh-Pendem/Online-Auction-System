import { io } from "socket.io-client";

const trimSlash = (value = "") => value.replace(/\/+$/, "");
const defaultApiBase = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";
const defaultSocketBase = import.meta.env.PROD ? window.location.origin : "http://localhost:5000";

export const API_BASE = trimSlash(
  import.meta.env.VITE_API_BASE_URL || defaultApiBase
);
export const SOCKET_BASE = trimSlash(
  import.meta.env.VITE_SOCKET_URL || defaultSocketBase
);

export function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function createSocket(token) {
  if (import.meta.env.VITE_ENABLE_SOCKET === "false") return null;
  return io(SOCKET_BASE, {
    auth: token ? { token } : {},
    transports: ["websocket", "polling"]
  });
}
