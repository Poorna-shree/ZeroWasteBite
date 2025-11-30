import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { ArrowLeft } from "lucide-react"; // 👈 Back icon
import { authDataContext } from "../context/AuthContext";

function SignUp() {
  const { serverUrl } = useContext(authDataContext);

  // 🌿 Green theme
  const primaryColor = "#22c55e";
  const hoverColor = "#16a34a";
  const bgColor = "#f6fff9";
  const borderColor = "#d1fae5";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🌱 Handle manual signup
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
      // navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  // 🔐 Handle Google sign-up
  const handleGoogleAuth = async () => {
    if (!mobile) return setErr("Mobile number is required before Google sign-up");

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(data));
      // navigate("/");
    } catch (error) {
      console.log(error);
      setErr("Google Sign-Up failed");
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
        {/* 👈 Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center gap-1 text-green-700 hover:text-green-900 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Title */}
        <h1
          className="text-3xl font-bold mb-2 mt-8 text-center"
          style={{ color: primaryColor }}
        >
          ZeroWasteBite
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Create your account to get started with your orders
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your Full Name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        </div>

        {/* Email */}
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

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Mobile
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            placeholder="Enter your Mobile Number"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
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

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "user", label: "Customer" },
              { key: "owner", label: "Farmer" },
              { key: "deliveryBoy", label: "Delivery Boy" },
              { key: "reduceWasteVolunteer", label: "Food Waste Reducer" },
            ].map((r) => (
              <button
                key={r.key}
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r.key)}
                style={
                  role === r.key
                    ? { backgroundColor: primaryColor, color: "white" }
                    : { border: `1px solid ${primaryColor}`, color: primaryColor }
                }
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            borderColor: primaryColor,
          }}
          onClick={handleSignUp}
          disabled={loading}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = hoverColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = primaryColor)
          }
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
        </button>

        {/* Error Message */}
        {err && <p className="text-red-500 text-center my-3">{err}</p>}

        {/* Google Sign Up */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>
        </button>

        {/* Sign In Redirect */}
        <p
          className="text-center mt-6 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span style={{ color: primaryColor }}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
