import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton, FaCreditCard } from "react-icons/fa6";
import { serverUrl } from '../App';
import { addMyOrder } from '../redux/userSlice';

function RecenterMap({ location }) {
  const map = useMap();
  if (location.lat && location.lon) {
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

function DraggableMarker({ location, dispatch, getAddressByLatLng }) {
  const map = useMap();
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    map.setView([lat, lng], 16, { animate: true });
    getAddressByLatLng(lat, lng);
  };

  return (
    location?.lat && location?.lon && (
      <Marker
        position={[location.lat, location.lon]}
        draggable
        eventHandlers={{ dragend: onDragEnd }}
      />
    )
  );
}

function CheckOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { location, address } = useSelector(state => state.map);
  const { cartItems, totalAmount, userData } = useSelector(state => state.user);

  const [addressInput, setAddressInput] = useState(address || '');
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const deliveryFee = totalAmount > 1500 ? 0 : 40;
  const totalWithDelivery = totalAmount + deliveryFee;

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(result?.data?.results?.[0]?.address_line2 || ""));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&format=json&apiKey=${apiKey}`
      );
      const firstResult = result?.data?.results?.[0];
      if (firstResult) {
        dispatch(setLocation({ lat: firstResult.lat, lon: firstResult.lon }));
        dispatch(setAddress(firstResult.address_line2 || ""));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {

    const latitude = userData.location.coordinates[1]
    const longitude = userData.location.coordinates[0]
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);

  };

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) return alert("Cart is empty");
    if (!addressInput || !location.lat || !location.lon) return alert("Please select a valid delivery address");

    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon
          },
          totalAmount: totalWithDelivery,
          cartItems
        },
        { withCredentials: true }
      );
      if (paymentMethod == "cod") {
        alert("Order placed successfully!");
        dispatch(addMyOrder(result.data))
        navigate("/order-placed"); // redirect after order
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
        openRazorpayWindow(orderId,razorOrder)
      }

    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert(`Error: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Error: No response from server.");
      } else {
        console.error("Request setup error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };


  const openRazorpayWindow=(orderId,razorOrder)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:razorOrder.amount,
      currency:'INR',
      name:"Zerowastebite",
      description:"Sustainablity Platform",
      order_id:razorOrder.id,
      handler:async function (response) {
        try {
          const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
            razorpay_payment_id:response.razorpay_payment_id,
            orderId
          },{withCredentials:true})
          dispatch(addMyOrder(result.data))
          navigate("/order-placed")
        } catch (error) {
          console.log(error)
        }
      }

    }
    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  // ✅ Group cart items by shop
  const itemsByShop = cartItems.reduce((acc, item) => {
    const shopName = item.shop?.name || "Unknown Shop";
    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(item);
    return acc;
  }, {});

  return (
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
      <div className='absolute top-[20px] left-[20px] z-[10]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>

      <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>

        {/* Delivery Location */}
        <section>
          <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'>
            <FaLocationDot className='text-[#ff4d2d]' /> Delivery Location
          </h2>

          <div className='flex gap-2 mb-3'>
            <input
              type="text"
              className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]'
              placeholder='Enter Your Delivery Address...'
              value={addressInput || ''}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getLatLngByAddress}>
              <IoIosSearch size={17} />
            </button>
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getCurrentLocation}>
              <TbCurrentLocation size={17} />
            </button>
          </div>

          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer
                className="w-full h-full"
                center={location?.lat && location?.lon ? [location.lat, location.lon] : [12.9716, 77.5946]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <DraggableMarker location={location} dispatch={dispatch} getAddressByLatLng={getAddressByLatLng} />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-xl' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                <p className='text-xs text-gray-500'>Pay when your Order arrives</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <FaMobileScreenButton className='text-purple-700 text-lg' />
              </span>
              <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <FaCreditCard className='text-blue-700 text-lg' />
              </span>
              <div>
                <p className='font-medium text-gray-800'>UPI / Credit / Debit Card</p>
                <p className='text-xs text-gray-500'>Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
          <div className='rounded-xl border bg-gray-50 p-4 space-y-4'>
            {Object.keys(itemsByShop).map(shopName => {
              const shopItems = itemsByShop[shopName];
              const shopSubtotal = shopItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

              return (
                <div key={shopName} className="border-b border-gray-200 pb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">{shopName}</h3>
                  {shopItems.map(item => (
                    <div key={item._id} className='flex justify-between text-sm text-gray-700'>
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className='flex justify-between font-medium text-gray-800 mt-1'>
                    <span>Subtotal</span>
                    <span>₹{shopSubtotal}</span>
                  </div>
                </div>
              );
            })}

            <div className='flex justify-between font-medium text-gray-800 pt-2'>
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className='flex justify-between font-medium text-gray-700'>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
              <span>Total</span>
              <span>₹{totalWithDelivery}</span>
            </div>
          </div>
        </section>

        <button
          className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold'
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
