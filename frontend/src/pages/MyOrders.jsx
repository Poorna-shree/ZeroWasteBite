import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'

function MyOrders() {
  const { userData, myOrders } = useSelector(state => state.user)
  const navigate = useNavigate()

  // Filter out delivered orders
  const filteredOrders = myOrders?.filter(
    order => order?.shopOrders?.status !== "delivered"
  )

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>
        <div className='flex items-center gap-[20px] mb-6'>
          <button
            className='z-[10] p-1 rounded-full hover:bg-[#ff4d2d]/10 transition'
            onClick={() => navigate(-1)}
          >
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
          </button>
          <h1 className='text-2xl font-bold text-start text-gray-900'>My Orders</h1>
        </div>

        <div className='space-y-6'>
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map(order =>
              userData?.role === "user" ? (
                <UserOrderCard data={order} key={order._id} />
              ) : userData?.role === "owner" ? (
                <OwnerOrderCard data={order} key={order._id} />
              ) : null
            )
          ) : (
            <p className='text-center text-gray-500 mt-10'>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
