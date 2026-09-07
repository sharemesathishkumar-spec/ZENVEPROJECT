import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

function Register({ onRegistered, onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/register/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

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
        const djangoError =
          data.detail ||
          data.error ||
          Object.values(data)
            .flat()
            .join(" ");

        throw new Error(
          djangoError || "Unable to create account."
        );
      }

      setSuccess(
        "Account created successfully. Please sign in."
      );

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Wait briefly so user can see success message
      setTimeout(() => {
        onRegistered();
      }, 1000);

    } catch (err) {
      console.error("Registration error:", err);

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
        <h1>Create account</h1>

        <p className="login-description">
          Create your Zenve Doctors account.
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

        {/* SUCCESS */}
        {success && (
          <div
            style={{
              background: "#ecfdf3",
              color: "#067647",
              border: "1px solid #abefc6",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
              required
            />

          </div>

          {/* EMAIL */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="new-password"
              required
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label>Confirm password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
              required
            />

          </div>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        {/* BACK TO LOGIN */}
        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "14px",
            color: "#777",
          }}
        >
          Already have an account?{" "}

          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              border: "none",
              background: "transparent",
              color: "#5d4bc9",
              fontWeight: "600",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;