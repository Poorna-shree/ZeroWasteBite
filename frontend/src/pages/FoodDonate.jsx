import React, { useState } from "react";
import { FaUtensils, FaMapMarkerAlt, FaCalendarAlt, FaWeightHanging } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

function FoodDonate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    location: "",
    pickupDate: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Assuming an API endpoint for submitting donation
await axios.post(`${serverUrl}/api/donations/create`, formData, { withCredentials: true });
      alert("Donation submitted successfully! Thank you for reducing food waste.");
      navigate("/dashboard"); // Or wherever you want to redirect
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center py-12 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Promote Food Donation
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Help reduce food waste by donating surplus food. Fill out the form below to connect with receivers in need.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-2xl transform hover:scale-105 transition-all"
      >
        {/* Food Type */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 flex items-center">
            <FaUtensils className="mr-2 text-green-500" />
            Food Type
          </label>
          <input
            type="text"
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            placeholder="e.g., Vegetables, Bread, Fruits"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 flex items-center">
            <FaWeightHanging className="mr-2 text-green-500" />
            Quantity
          </label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 5 kg, 10 boxes"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-green-500" />
            Pickup Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., 123 Main St, City, State"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Pickup Date */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-500" />
            Pickup Date
          </label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Additional Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any additional details about the food (e.g., expiry date, condition)"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Donation"}
        </button>
      </form>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-8 bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl shadow-lg transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default FoodDonate;
