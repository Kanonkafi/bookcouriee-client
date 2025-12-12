// // src/components/OrderModal.jsx
// import React, { useState } from 'react';
// import useAuth from '../hooks/useAuth';
// import useAxiosSecure from '../hooks/useAxiosSecure';
// import toast from 'react-hot-toast';
// import { FaTimes, FaShippingFast } from 'react-icons/fa';

// const OrderModal = ({ isOpen, onClose, bookDetails, refetchBookDetails }) => {
//     const { user } = useAuth();
//     const axiosSecure = useAxiosSecure();
//     const [loading, setLoading] = useState(false);
    
//     // ফর্ম ডেটা
//     const [formData, setFormData] = useState({
//         phoneNumber: '',
//         address: '',
//     });

//     if (!isOpen) return null;

//     const handleInputChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handlePlaceOrder = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const orderData = {
//             bookId: bookDetails._id,
//             name: bookDetails.name,
//             author: bookDetails.author,
//             price: bookDetails.price,
//             customerEmail: user.email,
//             customerName: user.displayName,
//             phoneNumber: formData.phoneNumber,
//             address: formData.address,
//             status: 'pending', // রিকোয়ারমেন্ট: প্রথম স্ট্যাটাস 'pending'
//             paymentStatus: 'unpaid', // রিকোয়ারমেন্ট: পেমেন্ট স্ট্যাটাস 'unpaid'
//             timestamp: new Date(),
//         };

//         try {
//             // সার্ভার সাইড রাউট: POST /orders
//             const res = await axiosSecure.post('/orders', orderData);
            
//             if (res.data.insertedId) {
//                 toast.success('Order placed successfully! Please proceed to My Orders to pay.');
//                 onClose();
//                 // বইয়ের ডিটেইলস রি-ফেচ করার জন্য, যাতে quantity আপডেট হয়
//                 refetchBookDetails(); 
//             } else {
//                 toast.error(res.data.message || 'Failed to place order.');
//             }
//         } catch (error) {
//             console.error("Order Placement Error:", error);
//             toast.error(error.response?.data?.message || 'Error placing order. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
//                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition">
//                     <FaTimes size={20} />
//                 </button>

//                 <h2 className="text-3xl font-bold text-indigo-600 dark:text-white mb-4">Place Your Order</h2>
//                 <p className="text-gray-600 dark:text-gray-400 mb-6">Book: <span className="font-semibold">{bookDetails.name}</span> (${bookDetails.price})</p>

//                 <form onSubmit={handlePlaceOrder} className="space-y-4">
//                     {/* Name (Readonly) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
//                         <input type="text" value={user?.displayName || ''} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700 border p-3 cursor-not-allowed" />
//                     </div>

//                     {/* Email (Readonly) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
//                         <input type="email" value={user?.email || ''} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700 border p-3 cursor-not-allowed" />
//                     </div>

//                     {/* Phone Number */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number (Required)</label>
//                         <input 
//                             type="tel" 
//                             name="phoneNumber" 
//                             value={formData.phoneNumber} 
//                             onChange={handleInputChange} 
//                             required 
//                             className="mt-1 block w-full rounded-md border border-indigo-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
//                         />
//                     </div>

//                     {/* Address */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address (Required)</label>
//                         <textarea 
//                             name="address" 
//                             rows="3"
//                             value={formData.address} 
//                             onChange={handleInputChange} 
//                             required 
//                             className="mt-1 block w-full rounded-md border border-indigo-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
//                         />
//                     </div>

//                     <button 
//                         type="submit" 
//                         disabled={loading || bookDetails.quantity === 0}
//                         className={`w-full py-3 text-lg font-bold text-white rounded-xl transition-all duration-300 flex justify-center items-center gap-2
//                             ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/40'}`}
//                     >
//                         {loading ? <FaShippingFast className="animate-pulse" /> : <FaShippingFast />}
//                         {loading ? 'Processing...' : 'Place Order'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default OrderModal;