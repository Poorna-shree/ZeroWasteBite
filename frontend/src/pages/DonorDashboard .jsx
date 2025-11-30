import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBoxOpen, FaChartPie, FaArrowLeft } from "react-icons/fa";
import useGetDonorProfile from "../hooks/useGetDonorProfile";

function DonorDashboard() {
  const navigate = useNavigate();
  useGetDonorProfile(); // ✅ fetch profile on dashboard load

  const actionCards = [
    {
      title: "Donate Food",
      icon: <FaBoxOpen className="text-white text-3xl" />,
      bg: "bg-green-500",
      onClick: () => navigate("/donate-food"),
    },
    {
      title: "View Profile",
      icon: <FaUserCircle className="text-white text-3xl" />,
      bg: "bg-green-600",
      onClick: () => navigate("/profile-donor"),
    },
    {
      title: "Your Contributions",
      icon: <FaChartPie className="text-white text-3xl" />,
      bg: "bg-green-700",
     onClick: () => navigate("/donor-contributions"), 
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          <FaArrowLeft /> Back
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/profile-donor")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow transition"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/donate-food")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow transition"
          >
            Donate Food
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl mb-8 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-2">Hello, Donor!</h2>
        <p className="text-gray-600 text-lg">
          Your contributions help reduce food waste and feed those in need. Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {actionCards.map((card) => (
          <div
            key={card.title}
            onClick={card.onClick}
            className={`${card.bg} cursor-pointer rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition`}
          >
            {card.icon}
            <p className="text-white text-lg mt-4 font-semibold">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorDashboard;
