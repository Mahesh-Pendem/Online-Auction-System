const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (defaultOrigins.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (/\.vercel\.app$/i.test(host)) return true;
    if (/\.onrender\.com$/i.test(host)) return true;
  } catch {
    return false;
  }
  return false;
}

function corsOriginCallback(origin, callback) {
  if (isAllowedOrigin(origin)) return callback(null, true);
  return callback(new Error("CORS not allowed"));
}

module.exports = { defaultOrigins, isAllowedOrigin, corsOriginCallback };
