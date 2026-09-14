import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./store/authSlice";
import "./login.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // Small delay so the loading state actually reads as feedback
    // instead of flashing for a single frame.
    setTimeout(() => {
      dispatch(
        login({
          email,
          password,
        }),
      );

      const savedUsers = localStorage.getItem("users");

      if (!savedUsers) {
        triggerError();
        return;
      }

      const users = JSON.parse(atob(savedUsers));

      const foundUser = users.find(
        (user) => user.email === email && user.password === password,
      );

      if (foundUser) {
        setError(false);
      } else {
        triggerError();
      }

      setLoading(false);
    }, 400);
  };

  const triggerError = () => {
    setError(true);
    setLoading(false);

    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? "shake" : ""}`}>
        <div className="brand-mark">
          <span className="brand-mark-icon">✓</span>
        </div>

        <form onSubmit={handleLogin}>
          <h1>Welcome Back</h1>

          <p>Continue managing your tasks.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            className={error ? "input-error" : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className={error ? "input-error" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />

            <button
              type="button"
              className="eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {error && <p className="login-error">❗ Invalid credentials</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <span className="spinner" /> : "Login"}
          </button>

          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#c9785d",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
