import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuVegan } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import useMarketPrice from "../hooks/useMarketPrice";

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCity, currentState } = useSelector(state => state.user);

  // Form states
  const [farmerName, setFarmerName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("vegitables");
  const [loading, setLoading] = useState(false);

  const categories = ["carrot", "tomato", "onion", "mango", "apple", "chilli", "rice", "Others"];

  // 🧠 Use effective category (handles "Others" with user input)
  const effectiveCategory = category === "Others" ? productName : category;

  // Market price fetching hook
  const {
    price: marketPrice,
    loading: priceLoading,
    source: priceSource,
    level: priceLevel
  } = useMarketPrice(effectiveCategory, currentState, currentCity);

  useEffect(() => {
    if (priceSource === "auto" && marketPrice) {
      setPrice(marketPrice);
    }
  }, [marketPrice, priceSource]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerName) return alert("Please enter farmer name.");
    if (!category) return alert("Please select a category.");
    if (category === "Others" && !productName)
      return alert("Please enter product name for 'Others'.");
    if (!price) return alert("Please enter price.");
    if (!backendImage) return alert("Please select a product image.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("farmerName", farmerName);
      formData.append("name", category === "Others" ? productName : category);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log("Error saving item:", error);
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative'>
      <div
        className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <LuVegan className='text-[#ff4d2d] w-16 h-16' />
          </div>
          <div className='text-3xl font-extrabold text-gray-900'>
            Add Product
          </div>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit}>
          {/* Farmer Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Farmer Name
            </label>
            <input
              type='text'
              placeholder='Enter Farmer Name'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Select Category
            </label>
            <select
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>{cate}</option>
              ))}
            </select>

            {/* Market price info */}
            {effectiveCategory && (
              <div className="mt-2 text-xs text-gray-600 bg-orange-50 rounded-md px-3 py-2 border border-orange-100">
                {priceLoading ? (
                  <p>Fetching current market price for <strong>{effectiveCategory}</strong>...</p>
                ) : marketPrice ? (
                  <>
                    <p>
                      Market price for <strong>{effectiveCategory}</strong> in{" "}
                      <strong>{currentCity || "your city"}, {currentState || "your state"}</strong>:
                    </p>
                    <p className="text-green-700 font-semibold mt-1">
                      ₹{marketPrice.toFixed(2)} per kg
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Data source level: <strong>{priceLevel}</strong>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">
                    Could not fetch live price for <strong>{effectiveCategory}</strong>.  
                    Showing recent price if available, or please enter manually.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Product Name if "Others" */}
          {category === "Others" && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Enter Product Name
              </label>
              <input
                type='text'
                placeholder='Enter Product Name'
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
          )}

          {/* Price Field */}
          <div>
            <label>Price per Kg (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full border px-4 py-2 rounded-lg ${priceSource === 'auto' ? 'bg-gray-100' : ''}`}
            />
            {priceSource === 'auto' && (
              <p className="text-xs text-green-600 mt-1">Auto-filled from market</p>
            )}
            {priceSource === 'manual' && (
              <p className="text-xs text-gray-500 mt-1">Enter price manually</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Select Product Type
            </label>
            <select
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="vegitables">vegitables</option>
              <option value="fruites">fruites</option>
            </select>
          </div>

          {/* Product Image */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Image
            </label>
            <input
              type='file'
              accept='image/*'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
              onChange={handleImage}
            />
            {frontendImage && (
              <div className='mt-4'>
                <img
                  src={frontendImage}
                  alt='Product Preview'
                  className='w-full h-48 object-cover rounded-lg border'
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color='white' /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
