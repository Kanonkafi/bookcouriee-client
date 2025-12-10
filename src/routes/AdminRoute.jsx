// src/routes/AdminRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/LoadingSpinner'; // আপনার LoadingSpinner ইম্পোর্ট করুন

const AdminRoute = ({ children }) => {
    const { isAdmin, isLoading } = useRole();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />; // লোডিং থাকলে স্পিনার দেখাও
    }

    if (isAdmin) {
        return children; // যদি অ্যাডমিন হয়, তবে চিলড্রেন দেখাও
    }

    // অ্যাডমিন না হলে হোমপেজে বা লগইনে পাঠিয়ে দাও
    return <Navigate to="/" state={location.pathname} replace={true} />;
};

export default AdminRoute;