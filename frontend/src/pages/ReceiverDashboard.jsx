import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle, FaBoxOpen, FaChartPie, FaArrowLeft } from "react-icons/fa";
import useGetReceiverProfile from "../hooks/useGetReceiverProfile";
import { serverUrl } from "../App"; // ✅ Add this import

function ReceiverDashboard() {
  const navigate = useNavigate();
  const { receiverData, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  // Fetch receiver profile
  useGetReceiverProfile();

  // Stop loading once receiverData is available
  useEffect(() => {
    if (receiverData !== undefined) {
      setLoading(false);
    }
  }, [receiverData]);

  // Block donors
  if (userData?.role === "donor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-600 text-lg">
          Donors cannot access the receiver dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  const actionCards = [
    {
      title: "Request Food",
      icon: <FaBoxOpen className="text-white text-3xl" />,
      bg: "bg-orange-500",
      onClick: () => navigate("/request-food"),

    },
    {
      title: receiverData ? "View Profile" : "Create Profile",
      icon: <FaUserCircle className="text-white text-3xl" />,
      bg: "bg-orange-600",
      onClick: () => navigate("/profile-receiver/edit"),
    },
    {
      title: "My Requests",
      icon: <FaChartPie className="text-white text-3xl" />,
      bg: "bg-orange-700",
      onClick: () => navigate("/my-requests"),
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Receiver Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/profile-receiver/edit")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow transition"
          >
            {receiverData ? "Profile" : "Create Profile"}
          </button>
          <button
            onClick={() => navigate("/request-food")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl shadow transition"
          >
            Request Food
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl mb-8 text-center">
        {receiverData?.image && (
          <img
            src={`${serverUrl}${receiverData.image}`} // ✅ fixed URL for backend port 8000
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
          />
        )}
        <h2 className="text-3xl font-bold text-orange-700 mb-2">
          Hello, {receiverData?.fullName || "Receiver"}!
        </h2>
        <p className="text-gray-600 text-lg">
          {receiverData
            ? "You can request food from nearby donors. Stay safe and help yourself when needed!"
            : "You haven’t created your profile yet. Click 'Create Profile' to get started!"}
        </p>
      </div>

      {/* Action Cards */}
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

export default ReceiverDashboard;
