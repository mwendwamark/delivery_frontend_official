import { useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { authAPI } from "../../Config/api";
import "./AuthPages.css";
import img1 from "../../assets/Images/HomeImages/HeroImage.jpg";
import { useNavigate } from "react-router-dom"; // ⭐⭐⭐ IMPORT useNavigate ⭐⭐⭐

// Message component
const MessageAlert = ({ type, text }) => {
  if (!text) return null;

  return (
    <div className={`message-alert ${type}`}>
      {type === "success" ? <CheckCircle /> : <AlertCircle />}
      <span>{text}</span>
    </div>
  );
};

// LoginForm component (No changes needed here, it receives handleLogin as prop)
const LoginForm = ({
  loginData,
  setLoginData,
  showPassword,
  setShowPassword,
  handleLogin,
  loading,
  message,
  switchToSignup,
}) => (
  <div className="auth-form ">
    <div className="auth-header">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your account</p>
    </div>

    <MessageAlert type={message.type} text={message.text} />

    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <div className="input-group">
          <Mail className="input-icon" />
          <input
            type="email"
            required
            value={loginData.email}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="input-group">
          <Lock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={loginData.password}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="form-input password-input"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="password-toggle"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="auth-submit-btn">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            Sign In
            <HiOutlineArrowLongRight />
          </>
        )}
      </button>
    </form>

    <div className="auth-footer">
      <p>
        Don't have an account?{" "}
        <button onClick={switchToSignup} className="auth-link" type="button">
          Sign up here
        </button>
      </p>
    </div>
  </div>
);

// SignupForm component (No changes needed here, it receives handleSignup as prop)
const SignupForm = ({
  signupData,
  setSignupData,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  handleSignup,
  loading,
  message,
  switchToLogin,
}) => (
  <div className="auth-form-wide">
    <div className="auth-header">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Join us today - it's free!</p>
    </div>

    <MessageAlert type={message.type} text={message.text} />

    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
    >
      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              required
              value={signupData.first_name}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              className="form-input"
              placeholder="Enter first name"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Last Name</label>
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              required
              value={signupData.last_name}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
              className="form-input"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="form-input"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="input-group">
            <Phone className="input-icon" />
            <input
              type="tel"
              required
              value={signupData.phone_number}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  phone_number: e.target.value,
                }))
              }
              className="form-input"
              placeholder="0712345678"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Date of Birth (Must be 18+ years old)
        </label>
        <div className="input-group">
          <Calendar className="input-icon" />
          <input
            type="date"
            required
            value={signupData.date_of_birth}
            onChange={(e) =>
              setSignupData((prev) => ({
                ...prev,
                date_of_birth: e.target.value,
              }))
            }
            className="form-input"
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split("T")[0]
            }
          />
        </div>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={signupData.password}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="form-input password-input"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              value={signupData.password_confirmation}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  password_confirmation: e.target.value,
                }))
              }
              className="form-input password-input"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="password-toggle"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="auth-submit-btn">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            Create Account
            <HiOutlineArrowLongRight />
          </>
        )}
      </button>
    </form>

    <div className="auth-footer">
      <p>
        Already have an account?{" "}
        <button onClick={switchToLogin} className="auth-link" type="button">
          Sign in here
        </button>
      </p>
    </div>
  </div>
);

// Main AuthPages component
const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // ⭐⭐⭐ INITIALIZE useNavigate ⭐⭐⭐

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    date_of_birth: "",
    role: 0,
  });

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  }, []);

  const handleLogin = useCallback(async () => {
    setLoading(true);

    try {
      const response = await authAPI.signIn({
        email: loginData.email,
        password: loginData.password,
      });

      // Check if the user is a customer (role 0)
      if (response.user.role !== 0) {
        showMessage("error", "Access Denied: This portal is for customers only.");
        // Force sign out and clear session if role mismatch
        authAPI.signOut();
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("authToken");
        return;
      }

      showMessage("success", response.message || "Login successful!");
      sessionStorage.setItem("user", JSON.stringify(response.user));
      sessionStorage.setItem("authToken", response.token);
      setLoginData({ email: "", password: "" });

      // ⭐⭐⭐ REDIRECT ON SUCCESSFUL LOGIN ⭐⭐⭐
      navigate('/products');

    } catch (error) {
      showMessage("error", error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [loginData, showMessage, navigate]); // ⭐⭐⭐ Add navigate to useCallback dependency array ⭐⭐⭐

  const handleSignup = useCallback(async () => {
    setLoading(true);

    if (signupData.password !== signupData.password_confirmation) {
      showMessage("error", "Passwords do not match");
      setLoading(false);
      return;
    }

    const birthDate = new Date(signupData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      showMessage("error", "You must be at least 18 years old to register");
      setLoading(false);
      return;
    }

    try {
      const { password_confirmation: _, ...userData } = signupData;
      // Ensure role is set to 0 (customer) for this portal
      userData.role = 0;
      const response = await authAPI.signUp(userData);

      showMessage(
        "success",
        response.message || "Account created successfully!"
      );
      setSignupData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
        password_confirmation: "",
        date_of_birth: "",
        role: 0,
      });
      // After successful signup and message, navigate to login page
      setTimeout(() => setCurrentPage("login"), 2000);
    } catch (error) {
      showMessage("error", error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, [signupData, showMessage]);

  const switchToSignup = useCallback(() => setCurrentPage("signup"), []);
  const switchToLogin = useCallback(() => setCurrentPage("login"), []);

  return (
    <div className="auth-container section">
      <div className="auth-card">
        {currentPage === "login" ? (
          <LoginForm
            loginData={loginData}
            setLoginData={setLoginData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleLogin={handleLogin}
            loading={loading}
            message={message}
            switchToSignup={switchToSignup}
          />
        ) : (
          <SignupForm
            signupData={signupData}
            setSignupData={setSignupData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleSignup={handleSignup}
            loading={loading}
            message={message}
            switchToLogin={switchToLogin}
          />
        )}

        <div className="auth-decoration">
          <div className="decoration-content">
            <img
              src={img1}
              alt="Wine Illustration"
              className="decoration-image"
            />
            <h2 className="decoration-title">
              {currentPage === "login" ? "Welcome Back" : "Sign up today!"}
            </h2>
            <p className="decoration-text">
              {currentPage === "login"
                ? "Sign in to access your personalized wine recommendations and exclusive offers."
                : "Create an account to start exploring our curated collection of liquor."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;