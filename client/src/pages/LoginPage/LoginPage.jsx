import { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./LoginPage.module.css";

export const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Временно проверяем логику или вызываем проп авторизации
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await onLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className={css.loginContainer}>
      <form className={css.loginForm} onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <p className={css.errorMsg}>{error}</p>}

        <label>
          Username / Email:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" className={css.loginBtn}>
          Sign In
        </button>
      </form>
    </div>
  );
};
