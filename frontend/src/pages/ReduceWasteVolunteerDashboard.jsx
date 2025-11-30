import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHandHoldingHeart, FaBoxOpen, FaNewspaper } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import Nav from "../components/Nav";

function ReduceWasteVolunteerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const roles = [
    {
      name: "Contributor",
      icon: <FaHandHoldingHeart className="text-6xl text-green-600 mb-4" />,
      description:
        "Donate your surplus food and help reduce waste by sharing it with those in need.",
      path: "/donor",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      name: "Receiver",
      icon: <FaBoxOpen className="text-6xl text-orange-500 mb-4" />,
      description:
        "Receive fresh, safe food donations from verified donors in your area.",
      path: "/receiver",
      bg: "bg-orange-50 hover:bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fff9f6] text-gray-800">
      {/* Navbar */}
      <Nav />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gradient-to-b from-[#ffe8d6] to-[#fff9f6]">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Reduce Food Waste, Serve the Community 🍲
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          Join hands to connect donors with receivers. As a volunteer, you can help ensure that
          surplus food reaches people in need instead of going to waste.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
          alt="Food Sharing"
          className="w-64 md:w-80 h-64 md:h-80 object-contain"
        />
      </div>

      {/* Role Selection Section */}
      <div className="flex flex-col items-center mt-16 px-6">
        <h2 className="text-4xl font-bold text-blue-400 mb-12">Choose Your Role</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => navigate(role.path)}
              className={`cursor-pointer rounded-2xl p-8 shadow-lg flex-1 flex flex-col items-center text-center transition-transform transform hover:scale-105 ${role.bg}`}
            >
              {role.icon}
              <h3 className="text-2xl font-semibold mb-2">{role.name}</h3>
              <p className="text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>

        {/* 📰 Navigate to News Page */}
        <button
          onClick={() => navigate("/news")}
          className="mt-10 flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md transition"
        >
          <FaNewspaper className="text-xl" />
          View Latest News
        </button>
      </div>
    </div>
  );
}

export default ReduceWasteVolunteerDashboard;
