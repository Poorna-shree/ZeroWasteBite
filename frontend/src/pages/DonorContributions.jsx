import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaPhoneAlt, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DonorContributions() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const serverUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/donations/my-donations`, {
          withCredentials: true,
        });
        setDonations(res.data.donations);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };
    fetchDonations();
  }, []);

  const handleDelete = async (donationId) => {
  if (!window.confirm("Are you sure you want to delete this donation?")) return;

  try {
    await axios.delete(`${serverUrl}/api/donations/delete/${donationId}`, {
      withCredentials: true,
    });

    alert("Donation deleted successfully.");
    setDonations((prev) => prev.filter((d) => d._id !== donationId)); // remove from UI
  } catch (err) {
    console.error("Error deleting donation:", err);
    alert("Failed to delete donation.");
  }
};


  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-green-700 mb-6">
        Your Contributions
      </h2>

      {donations.length === 0 ? (
        <p className="text-gray-500">No donations yet.</p>
      ) : (
        <div className="grid gap-6 w-full max-w-4xl">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                  <FaBox /> {donation.foodType}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    donation.status === "Collected"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {donation.status}
                </span>
              </div>

              <p>
                <strong>Posted Date:</strong>{" "}
                {new Date(donation.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                <FaMapMarkerAlt className="inline text-green-500 mr-1" />
                {donation.location}
              </p>
              <p>
                <strong>Quantity:</strong> {donation.quantity}
              </p>

      <div className="border-t pt-3 mt-2">
  <h4 className="font-semibold text-green-700">Receiver Details</h4>
  {donation.status === "Collected" ? (
    <>
      <p>
        <strong>Name:</strong> {donation.receiverName || "N/A"}
      </p>
      <p>
        <strong>Phone:</strong>{" "}
        <FaPhoneAlt className="inline text-green-500 mr-1" />
        {donation.receiverPhone || "N/A"}
      </p>
    </>
  ) : (
    <p className="text-gray-500 italic">Not yet collected</p>
  )}
</div>


            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorContributions;
