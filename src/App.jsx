
import { useEffect, useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "./App.css";

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("loginUser")) || null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "https://login-system-xl4w.onrender.com/api/auth";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getPasswordStrength = (value) => {
    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (isRegister) {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (strength < 3) {
        setError("Please choose a stronger password.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const endpoint = isRegister ? "/register" : "/login";
      const payload = isRegister
        ? { name: name.trim(), email: email.trim().toLowerCase(), password }
        : { email: email.trim().toLowerCase(), password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed. Please try again.");
      }

      if (isRegister) {
        setSuccess("Account created successfully! You can now sign in.");
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
        return;
      }

      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("loginUser", JSON.stringify(data.user));
      setUser(data.user);
      setPassword("");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure the server is running on port 5000."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("loginUser");
    setUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;

    fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error("Session expired");
        }
        sessionStorage.setItem("loginUser", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("loginUser");
        setUser(null);
      });
  }, []);

  if (user) {
    return (
      <main className="dashboard-page">
        <nav className="dashboard-nav">
          <a className="brand" href="#home">
            <span className="brand-icon">
              <ShieldCheck size={23} />
            </span>
            SecureSpace
          </a>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </nav>

        <section className="dashboard-content">
          <div className="welcome-icon">
            <ShieldCheck size={40} />
          </div>
          <p className="eyebrow">YOUR PERSONAL DASHBOARD</p>
          <h1>Welcome back, {user.name}!</h1>
          <p className="dashboard-description">
            You are viewing your secure dashboard. Your session is active.
          </p>

          <div className="dashboard-card">
            <div className="profile-avatar">
              <UserRound size={28} />
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <span className="status-badge">Authenticated</span>
          </div>

          <button className="primary-button" onClick={handleLogout}>
            Log out securely <ArrowRight size={18} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <a className="brand visual-brand" href="#home">
          <span className="brand-icon">
            <ShieldCheck size={23} />
          </span>
          SecureSpace
        </a>

        <div className="visual-content">
          <div className="visual-badge">
            <ShieldCheck size={16} />
            YOUR SECURITY, OUR PRIORITY
          </div>

          <h1>
            Your digital life,
            <br />
            <span>protected.</span>
          </h1>

          <p>
            A simpler, safer way to access your world. Sign in to continue
            your journey with confidence.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">
                <LockKeyhole size={20} />
              </span>
              <div>
                <h3>Secure access</h3>
                <p>Your account deserves protection.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3>Privacy first</h3>
                <p>Your experience, your control.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="visual-footer">
          © 2026 SecureSpace. Built for a safer digital world.
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-form-container">
          <div className="mobile-brand">
            <span className="brand-icon">
              <ShieldCheck size={23} />
            </span>
            SecureSpace
          </div>

          <div className="form-heading">
            <span className="form-label">
              {isRegister ? "GET STARTED" : "WELCOME BACK"}
            </span>

            <h2>{isRegister ? "Create your account" : "Sign in to your account"}</h2>

            <p>
              {isRegister
                ? "Join us today. It only takes a minute."
                : "Enter your details to access your account."}
            </p>
          </div>

          <div className="auth-switch">
            <button
              className={!isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
              }}
              type="button"
            >
              Sign In
            </button>

            <button
              className={isRegister ? "active" : ""}
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccess("");
              }}
              type="button"
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <div className="input-wrapper">
                  <UserRound size={19} />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail size={19} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                {!isRegister && (
                  <span className="password-hint">Min. 8 characters</span>
                )}
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={19} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                />
                <button
                  className="visibility-button"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {isRegister && password.length > 0 && (
                <div className="strength-container">
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <span
                        key={bar}
                        className={bar <= strength ? `strength-${strength}` : ""}
                      />
                    ))}
                  </div>
                  <p>
                    Password strength:{" "}
                    <strong>
                      {strength <= 2
                        ? "Weak"
                        : strength <= 3
                          ? "Fair"
                          : strength <= 4
                            ? "Good"
                            : "Strong"}
                    </strong>
                  </p>
                </div>
              )}
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="input-wrapper">
                  <LockKeyhole size={19} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    className="visibility-button"
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="form-options">
                <label className="remember-option">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    setError("Password reset will be available after backend setup.")
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && <div className="message error-message">{error}</div>}
            {success && (
              <div className="message success-message">{success}</div>
            )}

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
              {!isLoading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="security-note">
            <LockKeyhole size={15} />
            Your account is authenticated securely through the backend.
          </div>

          <p className="form-footer">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-button footer-link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;

