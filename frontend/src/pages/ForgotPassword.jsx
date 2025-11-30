import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const primaryColor = "#2ecc71";  // 🌿 Green theme
  const hoverColor = "#27ae60";
  const bgColor = "#f6fffa";

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      console.log(result);
      setErr("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setErr("Passwords do not match");
    }
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
      setErr("");
      console.log(result);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4' style={{ backgroundColor: bgColor }}>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        {/* Back button + title */}
        <div className='flex items-center gap-4 mb-4'>
          <IoIosArrowRoundBack
            size={30}
            className='cursor-pointer'
            style={{ color: primaryColor }}
            onClick={() => navigate("/signin")}
          />
          <h1 className='text-2xl font-bold text-center' style={{ color: primaryColor }}>
            Forgot Password
          </h1>
        </div>

        {/* Step 1: Email input */}
        {step === 1 && (
          <div>
            <div className='mb-6'>
              <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
              <input
                type="email"
                className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer'
              style={{ backgroundColor: primaryColor }}
              onClick={handleSendOtp}
              onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div>
            <div className='mb-6'>
              <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>OTP</label>
              <input
                type="text"
                className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                placeholder='Enter OTP'
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>
            <button
              className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer'
              style={{ backgroundColor: primaryColor }}
              onClick={handleVerifyOtp}
              onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div>
            <div className='mb-6'>
              <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
              <input
                type="password"
                className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                placeholder='Enter new password'
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className='mb-6'>
              <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
              <input
                type="password"
                className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none'
                placeholder='Enter confirm password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>

            <button
              className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer'
              style={{ backgroundColor: primaryColor }}
              onClick={handleResetPassword}
              onMouseOver={(e) => (e.target.style.backgroundColor = hoverColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
