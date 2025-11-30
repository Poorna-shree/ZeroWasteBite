import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App"; // ✅ Make sure serverUrl = "http://localhost:8000"
import { setReceiverData } from "../redux/userSlice";
import { ClockLoader } from "react-spinners";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function EditReceiverProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    receiverData,
    currentCity,
    currentState,
    currentAddress,
    userData,
  } = useSelector((state) => state.user);

  // ❌ Block Donors from editing Receiver Profile
  useEffect(() => {
    if (userData?.role === "donor") {
      alert("Donors cannot create or edit a receiver profile.");
      navigate("/"); // Redirect to home
    }
  }, [userData, navigate]);

  const [form, setForm] = useState({
    fullName: receiverData?.fullName || "",
    email: receiverData?.email || "",
    mobile: receiverData?.mobile || "",
    city: receiverData?.city || currentCity || "",
    state: receiverData?.state || currentState || "",
    address: receiverData?.address || currentAddress || "",
    image: null,
  });

  // ✅ Handle image path correctly for backend port 8000
  const [frontendImage, setFrontendImage] = useState(
    receiverData?.image ? `${serverUrl}${receiverData.image}` : ""
  );
  const [loading, setLoading] = useState(false);

  // Update form when receiverData changes
  useEffect(() => {
    if (receiverData) {
      setForm({
        fullName: receiverData.fullName || "",
        email: receiverData.email || "",
        mobile: receiverData.mobile || "",
        city: receiverData.city || currentCity || "",
        state: receiverData.state || currentState || "",
        address: receiverData.address || currentAddress || "",
        image: null,
      });
      setFrontendImage(
        receiverData.image ? `${serverUrl}${receiverData.image}` : ""
      );
    }
  }, [receiverData, currentCity, currentState, currentAddress]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setFrontendImage(URL.createObjectURL(files[0])); // live preview
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      // ✅ Correct backend port 8000
      const res = await axios.post(`${serverUrl}/api/receiver/update-profile`, formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});


      dispatch(setReceiverData(res.data));
      setLoading(false);
      navigate("/receiver"); // back to dashboard
    } catch (err) {
      console.error("Failed to save profile:", err);
      setLoading(false);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-orange-600 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">
            {receiverData ? "Edit Receiver Profile" : "Create Receiver Profile"}
          </h2>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Image Preview */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-orange-600 overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
              {frontendImage ? (
                <img
                  src={frontendImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-orange-600 text-6xl" />
              )}
            </div>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
              <FaUser className="text-orange-600" />
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
              <FaEnvelope className="text-orange-600" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
              <FaPhone className="text-orange-600" />
              <input
                name="mobile"
                placeholder="Mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
              <FaMapMarkerAlt className="text-orange-600" />
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex justify-center items-center"
          >
            {loading ? <ClockLoader size={20} color="white" /> : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditReceiverProfile;
