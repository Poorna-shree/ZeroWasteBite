import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

function DonorProfile() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/donor/get-my`, { withCredentials: true });
        setDonorData(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate("/profile-donor/edit");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Donor Profile</h1>
          <button
            onClick={() => navigate("/profile-donor/edit")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Edit
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col md:flex-row p-6 gap-8">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-start">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-green-700 overflow-hidden shadow-lg">
              {donorData?.image ? (
                <img
  src={donorData?.image ? `${serverUrl}${donorData.image}` : "/default-avatar.png"}
  alt="Profile"
  className="w-full h-full object-cover"
/>

              ) : (
                <div className="flex items-center justify-center w-full h-full text-green-300 text-8xl">
                  <FaUser />
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="text-lg md:text-xl flex items-center gap-3 font-medium text-gray-800">
              <FaUser className="text-green-700" />
              <span>{donorData?.fullName}</span>
            </div>
            <div className="text-lg md:text-xl flex items-center gap-3 font-medium text-gray-800">
              <FaEnvelope className="text-green-700" />
              <span>{donorData?.email}</span>
            </div>
            <div className="text-lg md:text-xl flex items-center gap-3 font-medium text-gray-800">
              <FaPhone className="text-green-700" />
              <span>{donorData?.mobile}</span>
            </div>
            <div className="text-lg md:text-xl flex items-center gap-3 font-medium text-gray-800">
              <FaMapMarkerAlt className="text-green-700" />
              <span>
                {donorData?.city}, {donorData?.state} - {donorData?.address}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="bg-green-100 p-6 text-center text-green-800 font-medium">
          Thank you for your contributions! Your generosity helps reduce food waste and feed those in need.
        </div>
      </div>
    </div>
  );
}

export default DonorProfile;
