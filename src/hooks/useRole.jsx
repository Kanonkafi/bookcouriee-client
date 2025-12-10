// src/hooks/useRole.jsx

import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const userEmail = user?.email;

    // React Query ব্যবহার করে রোল লোড করা
    const { data: roleData = {}, isLoading, isFetched } = useQuery({
        queryKey: ['userRole', userEmail],
        // user?.email থাকলে এবং Firebase লোড হয়ে গেলে তবেই রিকোয়েস্ট পাঠাও
        enabled: !loading && !!userEmail, 
        queryFn: async () => {
            if (!userEmail) return { role: 'user' }; // ইমেইল না থাকলে ডিফল্ট 'user'
            
            // সার্ভার থেকে ইউজারের রোল পাওয়া
            const res = await axiosSecure.get(`/user/role/${userEmail}`);
            return res.data; // { role: 'admin' } বা { role: 'librarian' } 
        }
    });

    const role = roleData?.role || 'user'; // রোল না পেলে ডিফল্ট 'user'
    
    // ব্যবহারের সুবিধার জন্য বুলিয়ান ভ্যালু
    const isAdmin = role === 'admin';
    const isLibrarian = role === 'librarian' || role === 'admin'; // অ্যাডমিনরাও বই যোগ করতে পারবে

    return { 
        role, 
        isAdmin, 
        isLibrarian, 
        isLoading: isLoading || loading, // Firebase loading + Role fetching loading
        isFetched
    };
};

export default useRole;