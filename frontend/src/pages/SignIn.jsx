import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase";
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { ArrowLeft } from "lucide-react"; // 👈 Added for back icon

function SignIn() {
  // 🌿 Green theme
  const primaryColor = "#22c55e";
  const hoverColor = "#16a34a";
  const bgColor = "#f6fff9";
  const borderColor = "#d1fae5";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔑 Handle Email/Password Sign-In
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
      // navigate("/"); // You can redirect to dashboard/home after successful login
    } catch (error) {
      setErr(error?.response?.data?.message || "Sign in failed");
      setLoading(false);
    }
  };

  // 🔐 Google Authentication
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(data));
      // navigate("/");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setErr(error?.response?.data?.message || "Google Sign-In failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border relative"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* 👈 Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-1 text-green-700 hover:text-green-900 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Logo + Title */}
        <h1 className="text-3xl font-bold mb-2 mt-8 text-center" style={{ color: primaryColor }}>
          ZeroWasteBite
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign In to your account to get started with your orders
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your Email"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none pr-10"
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-[14px] text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div
          className="text-right mb-4 cursor-pointer font-medium"
          style={{ color: primaryColor }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </div>

        {/* Sign In Button */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            borderColor: primaryColor,
          }}
          onClick={handleSignIn}
          disabled={loading}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
        </button>

        {/* Error Message */}
        {err && <p className="text-red-500 text-center my-3">{err}</p>}

        {/* Google Sign In */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-6 cursor-pointer">
          Want to create a new account?{" "}
          <span
            className="font-medium"
            style={{ color: primaryColor }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
