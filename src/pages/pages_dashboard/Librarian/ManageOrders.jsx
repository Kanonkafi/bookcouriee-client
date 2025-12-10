

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2';
import { FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; //icon
import { toast } from 'react-toastify';

const ManageOrders = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const librarianEmail = user?.email;

    //  এই লাইব্রেরিয়ানের বইয়ের জন্য সব অর্ডার লোড করা
    // সার্ভার রাউট: GET /manage-orders/:email (index.js এ এটি বিদ্যমান)
    const { 
        data: orders = [], 
        isLoading, 
        refetch 
    } = useQuery({
        queryKey: ['librarianOrders', librarianEmail],
        enabled: !loading && !!librarianEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/manage-orders/${librarianEmail}`);
            return res.data;
        }
    });

    // অর্ডারের স্ট্যাটাস পরিবর্তন করার হ্যান্ডলার
    const handleUpdateStatus = (order, newStatus) => {
        Swal.fire({
            title: `Change status to ${newStatus.toUpperCase()}?`,
            text: `Order ID: ${order._id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newStatus.toUpperCase()}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //  সার্ভার সাইডে নতুন PATCH রাউট যোগ করতে হবে: /orders/status/:id
                    const res = await axiosSecure.patch(`/orders/status/${order._id}`, { status: newStatus });
                    
                    if (res.data.modifiedCount > 0) {
                        toast.success(`Order status updated to ${newStatus}!`);
                        refetch(); 
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to update order status.', 'error');
                     console.log (error);
                }
            }
        });
    };
    
    //  অর্ডার বাতিল করার হ্যান্ডলার
    const handleCancelOrder = (order) => {
        Swal.fire({
            title: `Cancel Order?`,
            text: `You are about to cancel Order ID: ${order._id}. This action is irreversible.`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, Cancel it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার সাইডে নতুন PATCH রাউট যোগ করতে হবে: /orders/status/:id
                    const res = await axiosSecure.patch(`/orders/status/${order._id}`, { status: 'cancelled' });
                    
                    if (res.data.modifiedCount > 0) {
                        toast.success(`Order ${order._id} cancelled successfully!`);
                        refetch(); 
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to cancel order.', 'error');
                     console.log (error);
                }
            }
        });
    };


    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                📦 Manage Customer Orders ({orders.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className='bg-red-100 text-red-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Customer</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td className='font-semibold'>{order.name}</td>
                                <td>{order.customer}</td>
                                <td>{order.transactionId?.slice(0, 10)}...</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'delivered' ? 'bg-green-500 text-white' : 
                                        order.status === 'shipped' ? 'bg-blue-500 text-white' : 
                                        order.status === 'cancelled' ? 'bg-gray-500 text-white' : 
                                        'bg-yellow-500 text-white'
                                    }`}>
                                        {order.status?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </td>
                                
                                {/* Status Update Dropdown/Buttons */}
                                <td>
                                    {order.status === 'pending' && order.paymentStatus === 'paid' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(order, 'shipped')}
                                            className='btn btn-sm btn-info text-white me-2'
                                        >
                                            <FaShippingFast /> Ship
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(order, 'delivered')}
                                            className='btn btn-sm btn-success text-white'
                                        >
                                            <FaCheckCircle /> Deliver
                                        </button>
                                    )}
                                    {(order.status === 'delivered' || order.status === 'cancelled') && (
                                         <span className='text-sm text-gray-500'>Completed</span>
                                    )}
                                </td>

                                {/* Cancel Button */}
                                <td>
                                    {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                                        <button 
                                            onClick={() => handleCancelOrder(order)}
                                            className='btn btn-sm btn-error text-white'
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    ) : (
                                        <span className='text-sm text-gray-500'>N/A</span>
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

export default ManageOrders;