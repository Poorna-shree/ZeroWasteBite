import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LandingPage from "./pages/LandingPage"; // ✅ Import this

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import CreateEditShop from './pages/CreateEditShop';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import TrackOrderPage from './pages/TrackOrderPage';
import Shop from './pages/Shop';
import ReduceWasteVolunteerDashboard from './pages/ReduceWasteVolunteerDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import ReceiverProfile from './pages/ReceiverProfile';
import EditReceiverProfile from './pages/EditReceiverProfile';

import useGetCurrentUser from './hooks/useGetCurrentUser';
import useGetCity from './hooks/useGetCity';
import useGetMyShop from './hooks/useGetMyShop';
import useGetShopByCity from './hooks/useGetShopByCity';
import useGetItemsByCity from './hooks/useGetItemsByCity';
import useGetMyOrders from './hooks/useGetMyOrders';
import useUpdateLocation from './hooks/useUpdateLocation';
import DonorProfile from './pages/DonorProfile';
import DonorDashboard from './pages/DonorDashboard ';
import FoodDonate from './pages/FoodDonate';
import { io } from 'socket.io-client';
import { setSocket } from './redux/userSlice';
import useGetMyDonor from './hooks/useGetMyDonor';
import EditDonorProfile from './pages/EditDonorProfile';
import DonorContributions from './pages/DonorContributions';
import RequestFood from "./pages/RequestFood"; // ✅ import this
import MyRequests from './pages/MyRequests';
import NewsFeed from './components/NewsFeed';
import Homee from './pages/Homee';
export const serverUrl = "https://zwb-backend.onrender.com";

function App() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  // Hooks to fetch data
  useGetCurrentUser();
  useUpdateLocation();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useGetMyDonor();

  // Socket connection
  useEffect(() => {
    if (!userData?._id) return;
    const socketInstance = io(serverUrl, { withCredentials: true });
    dispatch(setSocket(socketInstance));

    socketInstance.on('connect', () => {
      console.log("✅ Socket connected:", socketInstance.id);
      socketInstance.emit('identity', { userId: userData._id });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userData?._id, dispatch]);

  return (
    <Routes>
      {/* Auth */}
      <Route path='/' element={userData ? <Home /> : <LandingPage />} />

      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

      {/* Main */}
      <Route path='/' element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
      <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to="/signin" />} />
      <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to="/signin" />} />
      <Route path='/cart' element={userData ? <CartPage /> : <Navigate to="/signin" />} />
      <Route path='/checkout' element={userData ? <CheckOut /> : <Navigate to="/signin" />} />
      <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to="/signin" />} />
      <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to="/signin" />} />
      <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />} />
      <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to="/signin" />} />
      <Route path="/news" element={<NewsFeed />} />
      <Route path="/home" element={<Homee />} />

      {/* Dashboards */}
      <Route path='/reduce-waste-volunteer' element={<ReduceWasteVolunteerDashboard />} />
      <Route path='/donor' element={<DonorDashboard />} />
      <Route path='/receiver' element={<ReceiverDashboard />} />

      {/* Donor Profile */}
      <Route path='/profile-donor' element={userData ? <DonorProfile /> : <Navigate to="/signin" />} />
      <Route path='/profile-donor/edit' element={userData ? <EditDonorProfile /> : <Navigate to="/signin" />} />

      {/* Receiver Profile */}
      <Route path='/profile-receiver' element={userData ? <ReceiverProfile /> : <Navigate to="/signin" />} />
      <Route path='/profile-receiver/edit' element={userData ? <EditReceiverProfile /> : <Navigate to="/signin" />} />

      {/* Other */}
      <Route path="/donor-contributions" element={<DonorContributions />} />
      <Route path="/my-requests" element={<MyRequests />} />
      
      <Route path="/request-food" element={<RequestFood />} />
      <Route path='/donate-food' element={<FoodDonate />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
