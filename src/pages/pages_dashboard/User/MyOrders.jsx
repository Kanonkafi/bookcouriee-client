// src/pages/pages_dashboard/User/MyOrders.jsx

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa'; // আইকন

const MyOrders = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const customerEmail = user?.email;

    // 🔑 React Query ব্যবহার করে এই ইউজারের সব অর্ডার লোড করা
    // সার্ভার রাউট: GET /my-orders/:email
    const { 
        data: orders = [], 
        isLoading, 
        refetch 
    } = useQuery({
        queryKey: ['myOrders', customerEmail],
        enabled: !loading && !!customerEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-orders/${customerEmail}`);
            return res.data;
        }
    });

    // 🔑 অর্ডার বাতিল করার হ্যান্ডলার
    const handleCancelOrder = (order) => {
        if (order.status !== 'pending') return;

        Swal.fire({
            title: `Cancel Order?`,
            text: `You are about to cancel the order for "${order.name}". This action is irreversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, Cancel it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার সাইড রাউট: PATCH /orders/status/:id
                    const res = await axiosSecure.patch(`/orders/status/${order._id}`, { status: 'cancelled' });
                    
                    if (res.data.modifiedCount > 0) {
                        toast.success(`Order for ${order.name} cancelled successfully!`);
                        refetch(); 
                    }
                } catch (error) {
                    toast.error('Failed to cancel order.');
                     console.log (error);
                }
            }
        });
    };
    
    // 🔑 "Pay Now" বাটনের হ্যান্ডলার
    const handlePayNow = (order) => {
        // 💡 এই ফাংশনটি ইউজারকে স্ট্রাইপ চেকআউট পেজে নিয়ে যাবে।
        // যেহেতু স্ট্রাইপ লজিক সার্ভারে কমেন্ট করা আছে, এখানে শুধু একটি টোস্ট দেখানো হলো।
        
        if (order.paymentStatus === 'paid' || order.status === 'cancelled') return;

        toast.loading(`Redirecting to payment for ${order.name}...`);
        
        // রিয়েল ইমপ্লিমেন্টেশনে এখানে axiosSecure.post('/create-checkout-session', { orderDetails... }) ব্যবহার হবে।
        console.log(`Simulating payment redirect for Order ID: ${order._id}`);
        // window.location.href = 'STRIPE_CHECKOUT_URL'; // 실제 ব্যবহারের জন্য 
    };


    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                🛒 My Orders ({orders.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className='bg-red-100 text-red-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Order Date</th>
                            <th>Amount</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td className='font-semibold'>{order.name}</td>
                                <td>{order.author}</td>
                                <td>{new Date(order.timestamp || order.createdAt).toLocaleDateString()}</td>
                                <td>{order.price} BDT</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'delivered' ? 'bg-green-500 text-white' : 
                                        order.status === 'shipped' ? 'bg-blue-500 text-white' : 
                                        order.status === 'cancelled' ? 'bg-gray-500 text-white' : 
                                        'bg-yellow-500 text-white'
                                    }`}>
                                        {order.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.paymentStatus === 'paid' ? 'bg-green-700 text-white' : 
                                        'bg-red-700 text-white'
                                    }`}>
                                        {order.paymentStatus?.toUpperCase() || 'UNPAID'}
                                    </span>
                                </td>
                                
                                {/* Actions: Pay Now / Cancel */}
                                <td>
                                    {/* 1. Pay Now Button (যদি pending এবং unpaid হয়) */}
                                    {order.status === 'pending' && order.paymentStatus !== 'paid' && (
                                        <button 
                                            onClick={() => handlePayNow(order)}
                                            className='btn btn-sm bg-green-600 hover:bg-green-700 text-white me-2'
                                        >
                                            <FaMoneyBillWave /> Pay Now
                                        </button>
                                    )}

                                    {/* 2. Cancel Button (যদি pending হয়) */}
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => handleCancelOrder(order)}
                                            className='btn btn-sm btn-error text-white'
                                        >
                                            <FaTrashAlt /> Cancel
                                        </button>
                                    )}

                                    {/* 3. Status Message (অন্যান্য ক্ষেত্রে) */}
                                    {order.status !== 'pending' && order.status !== 'cancelled' && (
                                        <span className='text-sm text-gray-500'>Order in {order.status.toUpperCase()}</span>
                                    )}
                                    {order.status === 'cancelled' && (
                                        <span className='text-sm text-gray-500'>Cancelled</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrders;