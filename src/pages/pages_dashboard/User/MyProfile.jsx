// ব্যবহারকারীর বর্তমান নাম এবং ছবির তথ্য দেখাবে এবং তা পরিবর্তন করার সুযোগ দেবে

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import { imageUpload } from '../../../utils'; // imageUpload ইউটিলিটি ব্যবহার

const MyProfile = () => {
    const { user, updateUserProfile, loading, setLoading } = useAuth(); // useAuth থেকে প্রয়োজনীয় জিনিসপত্র
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    
    //  ফর্ম সাবমিট হ্যান্ডলার
    const onSubmit = async (data) => {
        const toastId = toast.loading('Updating Profile...');
        setLoading(true); // লোডিং সেট করা
        
        const name = data.name;
        let photoURL = user?.photoURL;

        try {
            // ১. ইমেজ আপলোড হ্যান্ডলিং
            const imageFile = data.image[0];
            if (imageFile) {
                // যদি নতুন ইমেজ দেওয়া হয়, তবে সেটি আপলোড করা হবে
                photoURL = await imageUpload(imageFile);
                if (!photoURL) {
                    throw new Error("Image upload failed.");
                }
            }

            // ২. Firebase ইউজার প্রোফাইল আপডেট
            await updateUserProfile(name, photoURL);
            
            // ৩. MongoDB তে নাম আপডেট (যদি প্রয়োজন হয়)
            // Note: DB তে ইমেইল/রোল সেভ থাকায়, শুধু নাম আপডেট করে দিলেই যথেষ্ট।
            const updateDB = { name: name, photoURL: photoURL };
            await axiosSecure.put('/user', updateDB); // PUT /user রাউট ব্যবহার করে নাম আপডেট

            toast.success('Profile Updated Successfully!', { id: toastId });
            reset({ name: name, image: null }); // ফর্ম রিসেট

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error updating profile.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className='flex justify-center items-center h-screen'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className='max-w-xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg my-10'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                🛠️ My Profile
            </h2>
            
            <div className='flex flex-col items-center mb-6'>
                <div className='avatar'>
                    <div className='w-24 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2'>
                        <img src={user?.photoURL || 'https://i.ibb.co/L8GjK9c/user-default.png'} alt="Profile" />
                    </div>
                </div>
                <p className='text-xl font-semibold mt-3'>{user?.displayName || 'No Name Set'}</p>
                <p className='text-gray-500 text-sm'>{user?.email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                
                {/* User Name */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Update Name</label>
                    <input
                        {...register('name', { required: 'Name is required' })}
                        type='text'
                        defaultValue={user?.displayName || ''}
                        placeholder='Your Full Name'
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Profile Image */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Change Profile Image (Optional)</label>
                    <input
                        {...register('image')}
                        type='file'
                        accept='image/*'
                        className='block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
                    />
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-3 rounded-lg text-white font-semibold 
                    bg-red-600 hover:bg-red-700 transition duration-200'
                >
                    {isSubmitting ? <TbFidgetSpinner className='animate-spin m-auto' /> : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default MyProfile;