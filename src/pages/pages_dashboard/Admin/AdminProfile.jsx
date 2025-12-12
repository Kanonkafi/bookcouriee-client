import { useState, useEffect } from 'react'; 
import useAuth from '../../../hooks/useAuth';
import { FaUser, FaEnvelope, FaShieldAlt, FaCamera, FaEdit, FaSpinner } from 'react-icons/fa'; 
import { updateProfile } from 'firebase/auth'; // এটি Firebase Auth থেকে এসেছে
import Swal from 'sweetalert2';

const AdminProfile = () => {
  // useAuth থেকে loading, user, auth অবজেক্টগুলি গ্রহণ করা হচ্ছে
  const { user, setLoading, loading } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(''); 
  const [photoURL, setPhotoURL] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  // **Loading স্ক্রিন**
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <p className="ml-3 text-lg dark:text-white">Loading User Data...</p>
      </div>
    );
  }
  
  // **ইউজার লগইন না থাকলে হ্যান্ডলিং**
  if (!user) {
    return (
      <div className="text-center p-10 min-h-screen dark:text-white">
        <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  // 🔑 প্রোফাইল আপডেট হ্যান্ডলার
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!user) { 
      Swal.fire('Error', 'No user data available for update.', 'error');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 🔑 ফিক্স: auth.currentUser এর বদলে সরাসরি user অবজেক্টটি ব্যবহার করা হলো।
      // user অবজেক্টটি Firebase User ইনস্ট্যান্স, তাই এটি updateProfile এ কাজ করবে।
      await updateProfile(user, { 
        displayName: name,
        photoURL: photoURL
      });

      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully! Refreshing data...',
        icon: 'success'
      });

      setIsEditing(false); 

    } catch (error) {
      console.error("Profile Update Error:", error);
      Swal.fire('Error', error.message || 'Failed to update profile. Check console for details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-start pt-10">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
        
        {/* Profile Header */}
        <div className="text-center mb-8 relative">
          <img
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500 shadow-lg object-cover"
            src={user.photoURL || 'https://via.placeholder.com/150/0000FF/808080?text=Admin'}
            alt="Profile"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.displayName || 'Admin User'}</h1>
          <p className="text-lg text-red-600 dark:text-red-400 font-semibold flex items-center justify-center mt-1">
            <FaShieldAlt className="mr-2"/> Administrator
          </p>
        </div>

        {isEditing ? (
          // 🔑 এডিট ফর্ম
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300 flex items-center"><FaUser className="mr-2"/> Full Name</span>
              </label>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300 flex items-center"><FaCamera className="mr-2"/> Photo URL</span>
              </label>
              <input 
                type="url" 
                placeholder="Profile Image URL" 
                value={photoURL} 
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setName(user.displayName || ''); // ক্যান্সেল করলে user থেকে আগের ভ্যালু
                  setPhotoURL(user.photoURL || '');
                }}
                className="btn btn-outline btn-error dark:text-red-400"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300"
              >
                <FaEdit /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          // 🔑 ডিসপ্লে মোড 
          <>
            <div className="space-y-4">
              {/* Name Display */}
              <div className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <FaUser className="text-indigo-600 dark:text-indigo-400 w-5 h-5 mr-3"/>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.displayName || 'N/A'}</p>
                </div>
              </div>
              
              {/* Email Display (Read-only) */}
              <div className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <FaEnvelope className="text-indigo-600 dark:text-indigo-400 w-5 h-5 mr-3"/>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email || 'N/A'}</p>
                </div>
              </div>
              
              {/* Photo URL / Profile Picture Link (Optional) */}
              {user.photoURL && (
                <div className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <FaCamera className="text-indigo-600 dark:text-indigo-400 w-5 h-5 mr-3"/>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Image Link</p>
                    <a href={user.photoURL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-500 hover:underline truncate w-64 block">{user.photoURL}</a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;