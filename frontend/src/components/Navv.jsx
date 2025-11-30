import React, { useState } from 'react';
import logo2 from "../assets/lnlogo.jpeg";
import { IoSearch } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import dp from "../assets/profile.jpg";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Navv() {

  const [activeSearch, setActiveSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);   // ✅ FIXED — state added

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80px] bg-white fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] z-50">

      {/* Left Section */}
      <div className="flex justify-center items-center gap-[10px]">
        <div onClick={() => setActiveSearch(false)}>
          <img src={logo2} alt="logo" className="w-[70px]" />
        </div>

        {!activeSearch && (
          <IoSearch
            className="w-[23px] h-[23px] text-gray-700 lg:hidden"
            onClick={() => setActiveSearch(true)}
          />
        )}

        {/* Search Bar */}
        <form
          className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md 
          ${!activeSearch ? "hidden" : "flex"}`}
        >
          <IoSearch className="w-[23px] h-[23px] text-gray-700" />

          <input
            type="text"
            className="w-[80%] h-full bg-transparent outline-none border-0"
            placeholder="search users..."
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center gap-[20px] relative">

        {/* Popup */}
        {showPopup && (
          <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] right-0 rounded-lg flex flex-col items-center p-[20px] gap-[20px] z-50">

            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
              <img src={dp} alt="profile" className="w-full h-full" />
            </div>

            {/* Username */}
            <div className="text-[19px] font-semibold text-gray-800">
              {userData?.fullName || "Guest User"}
            </div>

            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]">
              View Profile
            </button>

            <div className="w-full h-[1px] bg-gray-700"></div>

            <div className="flex w-full items-center justify-start text-gray-600 gap-[10px]">
              <FaUserFriends className="w-[23px] h-[23px]" />
              <div>My Networks</div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogOut}
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Menu Icons */}
        <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden">
          <FaHome className="w-[23px] h-[23px]" />
          <div>Home</div>
        </div>

        <div className="md:flex flex-col items-center justify-center text-gray-600 hidden">
          <FaUserFriends className="w-[23px] h-[23px]" />
          <div>My Networks</div>
        </div>

        <div className="flex flex-col items-center justify-center text-gray-600">
          <IoIosNotifications className="w-[23px] h-[23px]" />
          <div className="hidden md:block">Notifications</div>
        </div>

        {/* Profile Icon (toggle popup) */}
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => setShowPopup(prev => !prev)}
        >
          <img src={dp} alt="profile" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Navv;
