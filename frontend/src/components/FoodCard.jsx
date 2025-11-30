import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa6";
import { FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../redux/userSlice';

function FoodCard({ data }) {
    const [quantity, setQuantity] = useState(0);
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);

    const cartItem = cartItems.find(i => i.id === data._id);
    const displayQty = cartItem ? cartItem.quantity : quantity;

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <FaStar key={i} className='text-yellow-500 text-lg' />
                ) : (
                    <FaRegStar key={i} className='text-yellow-500 text-lg' />
                )
            );
        }
        return stars;
    };

    const handleIncrease = () => {
        if (cartItem) {
            dispatch(updateQuantity({ id: data._id, quantity: cartItem.quantity + 1 }));
        } else {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrease = () => {
        if (cartItem && cartItem.quantity > 0) {
            dispatch(updateQuantity({ id: data._id, quantity: cartItem.quantity - 1 }));
        } else if (!cartItem && quantity > 0) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (displayQty > 0) {
            dispatch(addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                category: data.category,
                quantity: displayQty,
                shop: data.shop // ✅ ADD THE SHOP ID HERE
            }));
            setQuantity(0);
        }
    };

    return (
        <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
            <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
                <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
                    {data.foodType === "vegitables"
                        ? <FaLeaf className='text-green-600 text-lg' />
                        : <GiFruitBowl className='text-red-600 text-lg' />}
                </div>
                <img
                    src={data.image}
                    alt={data.name}
                    className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
            </div>

            <div className='flex-1 flex flex-col p-4'>
                <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data.rating?.average || 0)}
                    <span className='text-xs text-gray-500'>{data.rating?.count || 0}</span>
                </div>
                <span className="text-sm text-gray-500 mt-1">{data.category}</span>
            </div>

            <div className='flex items-center justify-between mt-auto p-3'>
                <span className='font-bold text-gray-900 text-lg'>₹{data.price}</span>

                <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
                    <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleDecrease}><FaMinus size={12} /></button>
                    <span>{displayQty}</span>
                    <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleIncrease}><FaPlus size={12} /></button>

                    <button
                        className={`${cartItems.some(i => i.id === data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"} text-white px-3 py-2 transition-colors`}
                        onClick={handleAddToCart}
                    >
                        <FaShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FoodCard;
