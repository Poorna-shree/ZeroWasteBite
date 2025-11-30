import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function RequestFood() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverUrl = "http://localhost:8000";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDonations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/donations/all`);
        setDonations(res.data.donations);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableDonations();
  }, []);

  const handleAccept = async (donationId) => {
    try {
      await axios.put(
        `${serverUrl}/api/donations/accept/${donationId}`,
        {},
        { withCredentials: true }
      );
      alert("Donation accepted successfully!");
      setDonations((prev) => prev.filter((donation) => donation._id !== donationId));
    } catch (err) {
      console.error("Error accepting donation:", err);
      alert("Failed to accept donation.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading available donations...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          Back
        </button>
        <h2 className="text-3xl font-bold text-orange-700">Available Donations</h2>
      </div>

      {donations.length === 0 ? (
        <p className="text-gray-500">No donations available right now.</p>
      ) : (
        <div className="grid gap-6 w-full max-w-4xl">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-3"
            >
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
             <p>
  <strong>Pickup Date:</strong>{" "}
  {donation.pickupDate
    ? new Date(donation.pickupDate).toLocaleDateString("en-GB")
    : "Date not available"}
</p>

              <p>
                <strong>Donor Contact:</strong>{" "}
                <FaPhoneAlt className="inline text-orange-500 mr-1" />
                {donation.donorPhone}
              </p>
              <button
                onClick={() => handleAccept(donation._id)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl mt-2 shadow transition"
              >
                Accept Donation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestFood;
