import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

function Login({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // Read the response as text first.
      // This prevents the "<!DOCTYPE" JSON error.
      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Django returned an unexpected response (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Invalid email or password."
        );
      }

      // Make sure Django actually returned the tokens
      if (!data.access || !data.refresh) {
        throw new Error(
          "Login succeeded, but Django did not return authentication tokens."
        );
      }

      // Save JWT tokens
      localStorage.setItem(
        "zenve_access_token",
        data.access
      );

      localStorage.setItem(
        "zenve_refresh_token",
        data.refresh
      );

      localStorage.setItem(
        "zenve_username",
        data.username || ""
      );

      localStorage.setItem(
        "zenve_email",
        data.email || email
      );

      // Go to Patients page
      onLogin();

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}
        <div className="login-logo">

          <div className="logo-mark large">
            Z
          </div>

          <div>
            <div className="logo-title">
              ZENVE
            </div>

            <div className="logo-subtitle">
              DOCTORS
            </div>
          </div>

        </div>

        {/* TITLE */}
        <h1>Welcome back</h1>

        <p className="login-description">
          Sign in to manage your veterinary practice.
        </p>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fff1f2",
              color: "#b42318",
              border: "1px solid #f3b4b4",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

          </div>

          {/* SIGN IN */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

        </form>

        {/* CREATE ACCOUNT */}
        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "14px",
            color: "#777",
          }}
        >
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onCreateAccount}
            style={{
              border: "none",
              background: "transparent",
              color: "#5d4bc9",
              fontWeight: "600",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Create account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;