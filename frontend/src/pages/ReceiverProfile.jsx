import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { serverUrl } from "../App"; // Make sure serverUrl = "http://localhost:8000"

function ReceiverProfile() {
  const navigate = useNavigate();
  const { receiverData } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Receiver Profile</h2>
        <button
          onClick={() => navigate("/profile-receiver/edit")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FaEdit /> Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white w-full max-w-3xl p-8 rounded-3xl shadow-lg text-center">
        {receiverData?.image ? (
          <img
            src={`${serverUrl}${receiverData.image}`} // ✅ prepend backend URL
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-400"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-4xl text-gray-500">
            👤
          </div>
        )}

        <h2 className="text-3xl font-semibold text-orange-700">
          {receiverData?.fullName || "No Name Provided"}
        </h2>
        <p className="text-gray-600 mt-2">{receiverData?.email || "No email added"}</p>
        <p className="text-gray-600">{receiverData?.mobile || "No phone added"}</p>

        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Address</h3>
          <p className="text-gray-700 bg-orange-50 p-3 rounded-lg">
            {receiverData?.address || "No address added yet."}
          </p>
        </div>

        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">
            Organization / NGO
          </h3>
          <p className="text-gray-700 bg-orange-50 p-3 rounded-lg">
            {receiverData?.organization || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReceiverProfile;
