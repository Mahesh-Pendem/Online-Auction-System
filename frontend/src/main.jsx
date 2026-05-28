import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep in console for debugging too.
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message =
      this.state.error?.message ||
      String(this.state.error || "Unknown error");

    return (
      <div className="page">
        <section className="panel wide">
          <h2>Something went wrong</h2>
          <p className="muted">
            The app crashed while loading. This message helps us pinpoint the
            issue.
          </p>
          <div className="viewer-card">
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{message}</pre>
          </div>
        </section>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
