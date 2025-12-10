// src/pages/BookDetails.jsx

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast'; // টোস্ট নোটিফিকেশনের জন্য
import { FaUser, FaTag, FaBookOpen, FaBoxesStacked, FaDollarSign } from 'react-icons/fa6';
// import OrderModal from '../../components/OrderModal'; // ❌ স্ট্রাইপ চেকআউটের জন্য মডাল আর দরকার নেই
import useAxiosSecure from '../../hooks/useAxiosSecure'; // 🔑 সিকিওর সার্ভার রিকোয়েস্টের জন্য
import useAuth from '../../hooks/useAuth'; // 🔑 ইউজার ইমেইল নেওয়ার জন্য

const BookDetails = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth(); // বর্তমান ইউজার তথ্য
    
    // বইয়ের ডিটেইলস ফেচ করা
    const { data: book = {}, isLoading } = useQuery({
        queryKey: ['bookDetails', id],
        queryFn: async () => {
           const res = await axios.get(`${API_URL}/books/${id}`);
           return res.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-20 text-xl dark:text-gray-300">Loading Book Details...</div>;
    }

    if (!book._id) {
        return <div className="text-center py-20 text-2xl text-red-500">Book not found.</div>;
    }

    const { name, author, price, image, category, description, quantity } = book;

    // 🔑 Stripe Checkout হ্যান্ডলার
    const handleBuyNow = async () => {
        if (!user || !user.email) {
            toast.error("Please log in to purchase the book.");
            return;
        }

        if (quantity === 0) {
             toast.error("This book is currently out of stock.");
             return;
        }

        // 💰 পেমেন্ট পে লোড তৈরি করা
        const paymentPayload = {
            bookId: book._id,
            price: price, 
            name: name,
            customerEmail: user.email, 
        };
        
        const toastId = toast.loading('Initiating Payment...');

        try {
            // সার্ভারকে Stripe Checkout সেশন তৈরির রিকোয়েস্ট পাঠানো
            const res = await axiosSecure.post('/create-checkout-session', paymentPayload);
            
            // Stripe থেকে পাওয়া URL এ ইউজারকে রিডাইরেক্ট করা
            if (res.data.url) {
                toast.dismiss(toastId); // লোডিং টোস্ট বন্ধ করা
                window.location.replace(res.data.url); // ইউজারকে Stripe এ নিয়ে যাওয়া
            } else {
                throw new Error("Failed to get checkout URL from server.");
            }
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            toast.error(error.response?.data?.message || 'Error initiating payment.', { id: toastId });
        }
    };


    return (
        <div className="py-16 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4">
                
                <div className="flex flex-col lg:flex-row gap-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-1/3 flex justify-center items-center">
                        <img
                            src={image}
                            alt={name}
                            className="w-full max-w-sm h-auto object-cover rounded-xl shadow-lg transition-transform duration-500 hover:scale-[1.03]"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{name}</h1>
                        
                        {/* Author & Category Badges */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <p className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-indigo-700 bg-indigo-100 border border-indigo-300">
                                <FaUser size={14} /> {author}
                            </p>
                            {category && (
                                <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-rose-500 shadow-md">
                                    <FaBookOpen size={14} /> {category}
                                </span>
                            )}
                        </div>

                        {/* Price & Stock */}
                        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 flex flex-wrap gap-6 items-center">
                            <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                <FaDollarSign size={24} />{price}
                            </h3>
                            {quantity > 0 ? (
                                <span className="flex items-center gap-2 text-lg font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full dark:text-orange-300 dark:bg-orange-900/40">
                                    <FaBoxesStacked size={16} /> {quantity} in Stock
                                </span>
                            ) : (
                                <span className="text-xl font-bold text-red-500">Out of Stock</span>
                            )}
                        </div>
                        
                        {/* Description */}
                        <div>
                            <h4 className="text-2xl font-semibold dark:text-white mb-2">Book Description</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
                        </div>

                        {/* Order Button */}
                        <button
                            onClick={handleBuyNow} // 🔑 নতুন হ্যান্ডলার ব্যবহার করা হয়েছে
                            disabled={quantity === 0}
                            className={`w-full sm:w-80 py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300
                                ${quantity > 0 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-purple-500/40' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {quantity > 0 ? 'Buy Now with Stripe' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* OrderModal আর দরকার নেই */}
            {/* <OrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                bookDetails={book}
            /> */}

        </div>
    );
};

export default BookDetails;