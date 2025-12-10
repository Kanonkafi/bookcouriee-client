// src/pages/pages_dashboard/Admin/AllUsers.jsx

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2';
// FaUser-ও ইম্পোর্ট করা হয়েছে সাধারণ ইউজার আইকনের জন্য
import { FaUserShield, FaUser, FaUsers } from 'react-icons/fa'; 

const AllUsers = () => { 
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    // React Query ব্যবহার করে সকল ইউজার লোড করা
    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['allUsers'],
        enabled: !loading && !!user, 
        queryFn: async () => {
            const res = await axiosSecure.get('/users'); 
            return res.data;
        }
    });

    // রোল পরিবর্তন করার হ্যান্ডলার (Demote এর জন্যও এই ফাংশনটি ব্যবহার করা হবে)
    const handleMakeRole = (userObj, newRole) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to set "${userObj.name}" as ${newRole.toUpperCase()}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, Make ${newRole.toUpperCase()}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার সাইডে PATCH /user/role/:id রাউটটি ব্যবহার করা
                    const res = await axiosSecure.patch(`/user/role/${userObj._id}`, { newRole });
                    
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            title: 'Success!',
                            text: `${userObj.name} is now a ${newRole.toUpperCase()}.`,
                            icon: 'success'
                        });
                        refetch(); // তালিকা আপডেট করা
                    }
                } catch (error) {
                    console.error("Role Update Error:", error);
                    Swal.fire('Error', 'Failed to change role.', 'error');
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
                👥 User Management ({users.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    {/* Table head (নতুন কলাম সহ) */}
                    <thead className='bg-red-100 text-red-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Make Librarian</th>
                            <th>Make Admin</th>
                            <th>Demote to User</th> {/* 🔑 নতুন কলাম */}
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td className='font-semibold'>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        user.role === 'admin' ? 'bg-red-500 text-white' : 
                                        user.role === 'librarian' ? 'bg-yellow-500 text-white' : 
                                        'bg-gray-200 text-gray-700'
                                    }`}>
                                        {user.role?.toUpperCase() || 'USER'}
                                    </span>
                                </td>

                                {/* Make Librarian Column */}
                                <td>
                                    {/* Librarian বা Admin হলে নতুন করে Make Librarian করার দরকার নেই */}
                                    {user.role === 'librarian' || user.role === 'admin' ? (
                                        <button disabled className='btn btn-sm bg-yellow-400 text-white border-0 cursor-not-allowed'>
                                            <FaUsers /> Librarian
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleMakeRole(user, 'librarian')}
                                            className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0"
                                        >
                                            <FaUsers /> Make Librarian
                                        </button>
                                    )}
                                </td>

                                {/* Make Admin Column */}
                                <td>
                                    {/* Admin হলে নতুন করে Make Admin করার দরকার নেই */}
                                    {user.role === 'admin' ? (
                                        <button disabled className='btn btn-sm bg-red-500 text-white border-0 cursor-not-allowed'>
                                            <FaUserShield /> Admin
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleMakeRole(user, 'admin')}
                                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0"
                                        >
                                            <FaUserShield /> Make Admin
                                        </button>
                                    )}
                                </td>

                                {/* 🔑 Demote to User Column */}
                                <td>
                                    {/* যদি already user হয়, তবে Disable থাকবে */}
                                    {user.role === 'user' ? (
                                        <button disabled className='btn btn-sm bg-gray-300 text-gray-700 border-0 cursor-not-allowed'>
                                            <FaUser /> User
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleMakeRole(user, 'user')} 
                                            className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-0"
                                        >
                                            <FaUser /> Demote to User
                                        </button>
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

export default AllUsers;