import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const serverUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/donations/my-requests`, {
          withCredentials: true,
        });
        setRequests(res.data.donations);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchMyRequests();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-3xl font-bold text-orange-700">My Accepted Donations</h2>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">You haven’t accepted any donations yet.</p>
      ) : (
        <div className="grid gap-6 w-full max-w-4xl">
          {requests.map((donation) => (
            <div key={donation._id} className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-orange-700 flex items-center gap-2">
                <FaBox /> {donation.foodType}
              </h3>

              <p>
                <strong>Quantity:</strong> {donation.quantity}

              </p>
              <p>
                <strong>Pickup Location:</strong>{" "}
                <FaMapMarkerAlt className="inline text-orange-500 mr-1" />
                {donation.location}
              </p>
              <p><strong>Name of Contributor:</strong> {donation.donorName}</p>
              <p>
                <strong>Contributor Contact: </strong>{" "}
                <FaPhoneAlt className="inline text-orange-500 mr-1" />
                {donation.donorPhone}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">{donation.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;
