// src/routes/LibrarianRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/LoadingSpinner'; // আপনার LoadingSpinner ইম্পোর্ট করুন

const LibrarianRoute = ({ children }) => {
    const { isLibrarian, isLoading } = useRole();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />; // লোডিং থাকলে স্পিনার দেখাও
    }

    if (isLibrarian) {
        return children; // যদি লাইব্রেরিয়ান হয়, তবে চিলড্রেন দেখাও
    }

    // লাইব্রেরিয়ান না হলে হোমপেজে বা লগইনে পাঠিয়ে দাও
    return <Navigate to="/" state={location.pathname} replace={true} />;
};

export default LibrarianRoute;