import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setReceiverData } from "../redux/userSlice";
import { ClockLoader } from "react-spinners";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function EditReceiverProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { receiverData, currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  const [form, setForm] = useState({
    fullName: receiverData?.fullName || "",
    email: receiverData?.email || "",
    mobile: receiverData?.mobile || "",
    city: receiverData?.city || currentCity || "",
    state: receiverData?.state || currentState || "",
    address: receiverData?.address || currentAddress || "",
    image: null,
  });

  const [frontendImage, setFrontendImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Set proper image preview URL (backend + uploaded)
  useEffect(() => {
    if (receiverData?.image) {
      if (receiverData.image.startsWith("http")) {
        setFrontendImage(receiverData.image);
      } else {
        setFrontendImage(`${serverUrl}${receiverData.image}`);
      }
    }
  }, [receiverData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setFrontendImage(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      const res = await axios.post(`${serverUrl}/api/receiver/create-edit`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setReceiverData(res.data));
      setLoading(false);
      navigate("/receiver");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">
            {receiverData ? "Edit Receiver Profile" : "Create Receiver Profile"}
          </h2>
        </div>

        {/* Form */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Image Preview */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-blue-700 overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
              {frontendImage ? (
                <img src={frontendImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-blue-700 text-6xl" />
              )}
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
              <FaUser className="text-blue-700" />
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
              <FaEnvelope className="text-blue-700" />
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
              <FaPhone className="text-blue-700" />
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
              <FaMapMarkerAlt className="text-blue-700" />
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
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition flex justify-center items-center"
          >
            {loading ? <ClockLoader size={20} color="white" /> : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditReceiverProfile;
