import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure'; // সিকিওর রিকোয়েস্টের জন্য
import toast from 'react-hot-toast';
import { FaCircleCheck, FaCircleXmark, FaSpinner, FaBox } from 'react-icons/fa6'; // FaBoxes আইকনটি যোগ করা হলো

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [transactionId, setTransactionId] = useState(null);
    const [orderId, setOrderId] = useState(null);

    // 🔑 useRef ব্যবহার করে নিশ্চিত করা যে পেমেন্ট ভেরিফিকেশন রিকোয়েস্ট একবারই যাবে
    const isVerified = useRef(false);

    useEffect(() => {
        // 1. URL থেকে session_id বের করা
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        // 🛑 ফিক্স ১: যদি sessionId না থাকে, তবে এরর না দেখিয়ে My Orders এ রিডাইরেক্ট করা
        if (!sessionId) {
            toast.error("Invalid access. Redirecting to Orders page.");
            // দ্রুত রিডাইরেক্ট, যাতে এরর স্টেট দেখা না যায়
            navigate('/my-orders', { replace: true }); 
            return;
        }

        // 🛑 ফিক্স ২: রিকোয়েস্ট যেন একবারই যায়
        if (isVerified.current) {
            return; 
        }

        // 2. সার্ভারে সেশন আইডি পাঠানো
        const verifyPayment = async () => {
            isVerified.current = true; // রিকোয়েস্ট শুরু হয়েছে, ফ্ল্যাগ সেট করা হলো
            setStatus('loading'); // নিশ্চিত করা হলো যেন লোডিং স্টেট দেখায়

            try {
                // সার্ভারের /payment-success রাউটে কল করা
                const res = await axiosSecure.post('/payment-success', { sessionId });

                if (res.data) {
                    setStatus('success');
                    setTransactionId(res.data.transactionId);
                    setOrderId(res.data.orderId);
                    
                    // যদি অর্ডার ইতোমধ্যে প্রসেস করা হয়ে থাকে (সার্ভার থেকে মেসেজ আসবে)
                    if (res.data.message.includes("Order already processed")) {
                        toast("Order already confirmed.", { icon: 'ℹ️' });
                    } else {
                        toast.success("Payment successful! Order confirmed.");
                    }
                    
                } else {
                    // সার্ভার থেকে 200 স্ট্যাটাস এলেও যদি ডেটা না থাকে
                    setStatus('error');
                    toast.error("Failed to confirm order after payment.");
                }

            } catch (err) {
                console.error("Verification Error:", err);
                setStatus('error');
                // সার্ভার 400/500 এরর দিলে সেই মেসেজটি দেখানো
                toast.error(err.response?.data?.message || 'Error processing your order. Please check My Orders page.');
            }
        };

        verifyPayment();

    }, [location.search, axiosSecure, navigate]);

    // রেন্ডারিং লজিক
    let icon, title, message;

    if (status === 'loading') {
        icon = <FaSpinner className="text-indigo-500 animate-spin" size={60} />;
        title = "Processing Order...";
        message = "We are confirming your payment and placing your order. Please wait.";
    } else if (status === 'success') {
        icon = <FaCircleCheck className="text-green-500" size={60} />;
        title = "Payment Successful!";
        message = "Your order has been placed successfully. Thank you for your purchase!";
    } else { // error
        icon = <FaCircleXmark className="text-red-500" size={60} />;
        title = "Payment Failed/Cancelled!";
        message = "We encountered an issue. Your payment might have failed or the session was cancelled. Please check your bank statement and My Orders page.";
    }


    return (
        <div className="min-h-[70vh] flex items-center justify-center py-16 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center space-y-6">
                
                {icon}
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
                
                {/* ট্রানজেকশন/অর্ডার আইডি তখনই দেখাবে যখন status success এবং আইডিগুলো পাওয়া গেছে */}
                {(status === 'success' && (transactionId || orderId)) && (
                    <div className="text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 border border-dashed border-indigo-300 dark:border-indigo-600">
                        {transactionId && (
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Transaction ID: <span className="font-mono text-indigo-600 dark:text-indigo-400 block break-all text-sm">{transactionId}</span>
                            </p>
                        )}
                        {orderId && (
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Order ID: <span className="font-mono text-indigo-600 dark:text-indigo-400 block break-all text-sm">{orderId}</span>
                            </p>
                        )}
                    </div>
                )}
                
                <button
                    onClick={() => navigate('/my-orders')}
                    className="w-full py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-purple-500/40 flex items-center justify-center space-x-2"
                >
                    <FaBox/>
                    <span>View My Orders</span>
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;