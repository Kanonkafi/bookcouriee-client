// src/components/OrderModal.jsx

import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure'; // অর্ডারের জন্য সুরক্ষিত হুক
import toast from 'react-hot-toast';

const OrderModal = ({ isOpen, onClose, bookDetails }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        const toastId = toast.loading('Placing your order...');

        // 1. Prepare Order Data
        const orderData = {
            bookId: bookDetails._id,
            bookName: bookDetails.name,
            bookPrice: bookDetails.price,
            ordererName: user?.displayName || data.name, // Readonly থেকে না এলে ফর্ম থেকে
            ordererEmail: user?.email || data.email, // Readonly থেকে না এলে ফর্ম থেকে
            phoneNumber: data.phoneNumber,
            address: data.address,
            
            // Default Statuses
            status: "pending", 
            paymentStatus: "unpaid",
            
            // Server-side এ createdAt যোগ করা হবে, তবুও ক্লায়েন্ট সাইডেও দেওয়া যায়
        };

        try {
            // 2. Post Order to Backend
            const res = await axiosSecure.post('/orders', orderData);

            if (res.data.insertedId) {
                toast.success('Order placed successfully!', { id: toastId });
                // 3. Reset form and close modal
                reset(); 
                onClose();
                
                // Note: এখানে inventory রিফ্রেশ করার জন্য bookDetails query রিকনফিগার করা যেতে পারে।
            } else {
                throw new Error('Failed to place order in DB.');
            }

        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Order failed. Please try again.', { id: toastId });
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" 
             onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-full max-w-lg shadow-2xl relative" 
                 onClick={(e) => e.stopPropagation()}>
                
                <h3 className="text-2xl font-bold dark:text-white mb-4 border-b pb-2">Order Confirmation</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You are ordering: <span className="font-semibold text-indigo-600">{bookDetails.name}</span>
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Name (Readonly) */}
                    <div>
                        <label className="label dark:text-gray-300">Name</label>
                        <input type="text" 
                               defaultValue={user?.displayName || 'User'} 
                               readOnly 
                               className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
                               {...register("name")}
                        />
                    </div>
                    
                    {/* Email (Readonly) */}
                    <div>
                        <label className="label dark:text-gray-300">Email</label>
                        <input type="email" 
                               defaultValue={user?.email || 'user@example.com'} 
                               readOnly 
                               className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
                               {...register("email")}
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="label dark:text-gray-300">Phone Number <span className="text-red-500">*</span></label>
                        <input type="text" 
                               placeholder="Enter your phone number" 
                               className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               {...register("phoneNumber", { required: true })}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="label dark:text-gray-300">Delivery Address <span className="text-red-500">*</span></label>
                        <textarea 
                               placeholder="Enter your full address" 
                               className="textarea textarea-bordered w-full h-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                               {...register("address", { required: true })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" 
                                onClick={onClose} 
                                className="btn btn-ghost dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        <button type="submit" 
                                className="btn bg-indigo-600 text-white hover:bg-indigo-700">
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;