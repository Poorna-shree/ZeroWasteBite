import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { setDonorData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function CreateEditDonor() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { donorData, currentCity, currentState, currentAddress } = useSelector(state => state.user);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [address, setAddress] = useState("");
    const [frontendImage, setFrontendImage] = useState("");
    const [backendImage, setBackendImage] = useState(null);
    const [loading, setLoading] = useState(false);

   useEffect(() => {
  if (donorData) {
    setFullName(donorData.fullName || "");
    setEmail(donorData.email || "");
    setMobile(donorData.mobile || "");
    setAddress(donorData.address || currentAddress || "");
    setCity(donorData.city || currentCity || "");
    setState(donorData.state || currentState || "");
    setFrontendImage(
      donorData.image ? `${serverUrl}${donorData.image}` : ""
    ); // ✅ Corrected here
  } else {
    setAddress(currentAddress || "");
    setCity(currentCity || "");
    setState(currentState || "");
  }
}, [donorData, currentAddress, currentCity, currentState]);


    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("mobile", mobile);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("address", address);
            if (backendImage) formData.append("image", backendImage);

            const result = await axios.post(`${serverUrl}/api/donor/create-edit`, formData, { withCredentials: true });
            dispatch(setDonorData(result.data));
            setLoading(false);
            navigate("/donor");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex justify-center items-center bg-green-50 p-6'>
            <div className='max-w-3xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden'>
                {/* Header */}
                <div className='bg-green-700 p-6 flex justify-between items-center'>
                    <h2 className='text-3xl font-bold text-white'>
                        {donorData ? "Edit Donor Profile" : "Create Donor Profile"}
                    </h2>
                </div>

                {/* Form */}
                <form className='p-6 space-y-6' onSubmit={handleSubmit}>
                    <div className='flex flex-col md:flex-row items-center gap-6'>
                        {/* Image Upload */}
                        <div className='w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-green-700 overflow-hidden shadow-lg flex items-center justify-center bg-gray-100'>
                            {frontendImage ? (
                                <img src={frontendImage} alt="Profile" className='w-full h-full object-cover' />
                            ) : (
                                <FaUser className='text-green-700 text-6xl' />
                            )}
                        </div>
                        <div className='flex-1 flex flex-col gap-4'>
                            <input
                                type="file"
                                accept='image/*'
                                onChange={handleImage}
                                className='w-full px-4 py-2 border rounded-lg'
                            />
                        </div>
                    </div>

                    {/* Text Inputs */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-2 border rounded-lg px-4 py-2'>
                            <FaUser className='text-green-700' />
                            <input type="text" placeholder='Full Name' value={fullName} onChange={(e)=>setFullName(e.target.value)} className='w-full outline-none'/>
                        </div>
                        <div className='flex items-center gap-2 border rounded-lg px-4 py-2'>
                            <FaEnvelope className='text-green-700' />
                            <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full outline-none'/>
                        </div>
                        <div className='flex items-center gap-2 border rounded-lg px-4 py-2'>
                            <FaPhone className='text-green-700' />
                            <input type="text" placeholder='Mobile' value={mobile} onChange={(e)=>setMobile(e.target.value)} className='w-full outline-none'/>
                        </div>
                        <div className='flex items-center gap-2 border rounded-lg px-4 py-2'>
                            <FaMapMarkerAlt className='text-green-700' />
                            <input type="text" placeholder='City' value={city} onChange={(e)=>setCity(e.target.value)} className='w-full outline-none'/>
                        </div>
                        <input type="text" placeholder='State' value={state} onChange={(e)=>setState(e.target.value)} className='w-full px-4 py-2 border rounded-lg'/>
                        <input type="text" placeholder='Address' value={address} onChange={(e)=>setAddress(e.target.value)} className='w-full px-4 py-2 border rounded-lg'/>
                    </div>

                    {/* Submit Button */}
                    <button type='submit' disabled={loading} className='w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition flex justify-center items-center'>
                        {loading ? <ClockLoader size={20} color='white'/> : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateEditDonor;
