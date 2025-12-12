// src/layouts/DashboardLayout.jsx

import { NavLink, Outlet, Navigate } from 'react-router-dom'; // 🔑 Navigate ইম্পোর্ট করা হলো
import useRole from '../hooks/useRole';
import { FaUser, FaBook, FaPlus, FaList, FaUsers, FaHome,FaDollarSign, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
  const { role, isRoleLoading } = useRole();
  const { logOut, user } = useAuth();
  
  if (isRoleLoading) {
    // লোডিং স্ক্রিন
    return <div className="min-h-screen flex justify-center items-center text-2xl dark:text-gray-300">Loading Dashboard...</div>;
  }

  const handleLogout = () => {
    logOut().then(() => {});
  };

  // 🔑 রোল অনুযায়ী ডিফল্ট রিডাইরেক্ট পাথ সেট করা
  let defaultRedirectPath;
  if (role === 'admin') {
    defaultRedirectPath = '/dashboard/all-users'; 
  } else if (role === 'librarian') {
    // লাইব্রেরিয়ানের প্রথম মেনু আইটেম
    defaultRedirectPath = '/dashboard/add-book'; 
  } else { // 'user' বা ডিফল্ট
    defaultRedirectPath = '/dashboard/my-orders';
  }


  // 🔗 রোল-ভিত্তিক লিঙ্কসমূহ (এই অংশ অপরিবর্তিত)
  let dashboardLinks;

  if (role === 'admin') {
    dashboardLinks = (
      <>
        <NavLink to="all-users" className="dashboard-link">
          <FaUsers /> All Users
        </NavLink>
        <NavLink to="manage-books" className="dashboard-link">
          <FaBook /> Manage All Books
        </NavLink>
        <NavLink to="admin-profile"className="dashboard-link"> 
          <FaUser /> My Profile
        </NavLink>
      </>
    );
  } else if (role === 'librarian') {
    dashboardLinks = (
      <>
        <NavLink to="add-book" className="dashboard-link">
          <FaPlus /> Add New Book
        </NavLink>
        <NavLink to="my-books" className="dashboard-link">
          <FaList /> My Inventory
        </NavLink>
        <NavLink to="orders" className="dashboard-link">
          <FaBook /> Manage Orders
        </NavLink>
      </>
    );
  } else { // ডিফল্ট User বা 'user'
    dashboardLinks = (
      <>
        <NavLink to="my-orders" className="dashboard-link">
          <FaList /> My Orders
        </NavLink>
        <NavLink to="my-profile" className="dashboard-link">
          <FaUser /> My Profile
        </NavLink>
        <NavLink to="invoices" className="dashboard-link">
          <FaDollarSign /> Invoices
        </NavLink>
        <NavLink to="wishlist" className="dashboard-link">
          <FaBook /> Wishlist
        </NavLink>
      </>
    );
  }
  
  // Tailwind ক্লাসের জন্য (আপনার প্রয়োজন অনুযায়ী স্টাইল করুন)
 // const activeClass = "bg-indigo-600 text-white";
  const defaultClass = "text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700";

  return (
    <div className="flex min-h-screen dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-xl p-6 border-r dark:border-gray-700">
        
        {/* Profile Info */}
        <div className="text-center mb-6 pb-4 border-b dark:border-gray-700">
          <img src={user?.photoURL || 'default-avatar.png'} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
          <h3 className="text-lg font-bold dark:text-white">{user?.displayName}</h3>
          <p className="text-sm text-indigo-500 font-semibold capitalize">Role: {role}</p>
        </div>

        {/* Dashboard Links */}
        <nav className="space-y-2">
          {/* Role-Specific Links */}
          {dashboardLinks}

          <div className="divider dark:before:bg-gray-700 dark:after:bg-gray-700"></div> 

          {/* Shared Links */}
          <NavLink to="/" className={`${defaultClass} flex items-center gap-3 p-3 rounded-lg font-medium transition duration-200`}>
            <FaHome /> Go to Home
          </NavLink>
          
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 p-3 rounded-lg font-medium transition duration-200 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8">
                {/* 🔑 ফিক্স: যদি /dashboard এ লোড হয়, তাহলে ডিফল্ট পেজে নেভিগেট করা */}
                {window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/' ? (
                    <Navigate to={defaultRedirectPath} replace />
                ) : (
                    <Outlet />
                )}
      </div>
    </div>
  );
};

export default DashboardLayout;