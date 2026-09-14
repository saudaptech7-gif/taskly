import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "./store/authSlice";
import "./signup.css";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shake, setShake] = useState(false);

  const validate = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required";

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.trim().length < 6) {
      errors.password = "At least 6 characters";
    }

    return errors;
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (loading) return;

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShake(true);
      setTimeout(() => setShake(false), 420);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    setTimeout(() => {
      dispatch(
        signup({
          name,
          email,
          password,
        }),
      );

      setLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/login"), 700);
    }, 400);
  };

  return (
    <div className="signup-page">
      <div className={`signup-card ${shake ? "shake" : ""}`}>
        <div className="brand-mark">
          <span className="brand-mark-icon">✓</span>
        </div>

        <h1>Create Account</h1>

        <p>Start organizing your tasks beautifully.</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            className={fieldErrors.name ? "input-error" : ""}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {fieldErrors.name && (
            <p className="field-error">❗ {fieldErrors.name}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            className={fieldErrors.email ? "input-error" : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {fieldErrors.email && (
            <p className="field-error">❗ {fieldErrors.email}</p>
          )}

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className={fieldErrors.password ? "input-error" : ""}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
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
          {fieldErrors.password && (
            <p className="field-error">❗ {fieldErrors.password}</p>
          )}

          <button type="submit" disabled={loading || success}>
            {loading ? (
              <span className="spinner" />
            ) : success ? (
              "✓ Account created"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#c9785d",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
