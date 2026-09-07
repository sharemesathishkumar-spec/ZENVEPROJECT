import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Patients from "./pages/Patients";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("zenve_access_token")),
  );

  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("zenve_access_token");

    localStorage.removeItem("zenve_refresh_token");

    localStorage.removeItem("zenve_username");

    setLoggedIn(false);
  };

  if (loggedIn) {
    return <Patients onLogout={handleLogout} />;
  }

  if (showRegister) {
    return (
      <Register
        onRegistered={() => setShowRegister(false)}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onCreateAccount={() => setShowRegister(true)}
    />
  );
}

export default App;
