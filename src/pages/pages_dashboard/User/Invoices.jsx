// user er pay payment korle ter trasectionid o dektepabe 

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 

const Invoices = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const customerEmail = user?.email;

    // সার্ভার থেকে শুধুমাত্র PAID অর্ডারগুলো লোড করা (ইনভয়েস হিসেবে)
    // Note: আমরা MyOrders রাউটটিকেই ব্যবহার করব, তবে ক্লায়েন্ট সাইডে ফিল্টার করে শুধু paid অর্ডার দেখাবো।
    const { 
        data: allOrders = [], 
        isLoading 
    } = useQuery({
        queryKey: ['userInvoices', customerEmail],
        enabled: !loading && !!customerEmail,
        queryFn: async () => {
            // GET /my-orders/:email রাউট ব্যবহার করা হচ্ছে
            const res = await axiosSecure.get(`/my-orders/${customerEmail}`);
            return res.data;
        }
    });

    // শুধুমাত্র 'paid' স্ট্যাটাসের অর্ডারগুলি ফিল্টার করা
    const paidInvoices = allOrders.filter(order => order.paymentStatus === 'paid' && order.transactionId);


    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                🧾 Payment History / Invoices ({paidInvoices.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className='bg-red-100 text-red-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Amount</th>
                            <th>Payment ID</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paidInvoices.map((order, index) => (
                            <tr key={order._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td className='font-semibold'>{order.name}</td>
                                <td>{order.price} BDT</td>
                                {/* Transaction ID বড় হওয়ায় ছোট করে দেখানো */}
                                <td className='text-sm'>{order.transactionId?.slice(0, 8)}...</td> 
                                <td>
                                    {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paidInvoices.length === 0 && (
                    <div className='text-center py-10 text-gray-500'>
                        <p>No successful payments found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invoices;