// src/pages/pages_dashboard/Librarian/AddBook.jsx

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { imageUpload } from '../../../utils'; // imageUpload ইউটিলিটি ব্যবহার

const AddBook = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    // 🔑 ফর্ম সাবমিট হ্যান্ডলার
    const onSubmit = async (data) => {
        const toastId = toast.loading('Adding Book...');
        
        try {
            // ১. ইমেজ আপলোড
            const imageFile = data.image[0];
            const imageUrl = await imageUpload(imageFile);

            // ২. বইয়ের ডেটা তৈরি
            const bookData = {
                name: data.name,
                author: data.author,
                price: parseFloat(data.price), // স্ট্রিং থেকে ফ্লোটে পরিবর্তন
                status: data.status, // published বা unpublished
                description: data.description,
                image: imageUrl,
                quantity: parseInt(data.quantity), // ইন্টিজারে পরিবর্তন
                category: data.category,
                // সেলারের তথ্য (Librarian)
                seller: {
                    email: user?.email,
                    name: user?.displayName || 'Unknown Librarian',
                },
            };

            // ৩. সার্ভারে POST রিকোয়েস্ট পাঠানো (index.js এ এই রাউটটি আছে)
            const response = await axiosSecure.post('/books', bookData);

            if (response.data.insertedId) {
                toast.success('Book Added Successfully!', { id: toastId });
                reset(); // ফর্ম রিসেট
                navigate('/dashboard/my-books'); // My Books পেজে রিডাইরেক্ট
            } else {
                 toast.error('Failed to add book.', { id: toastId });
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error uploading image or adding book.', { id: toastId });
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg my-10'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                ➕ Add New Book
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    
                    {/* Book Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Book Name</label>
                        <input
                            {...register('name', { required: 'Book Name is required' })}
                            type='text'
                            placeholder='The Alchemist'
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Book Author */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Author Name</label>
                        <input
                            {...register('author', { required: 'Author Name is required' })}
                            type='text'
                            placeholder='Paulo Coelho'
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                        {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
                    </div>
                    
                    {/* Price */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Price (BDT)</label>
                        <input
                            {...register('price', { 
                                required: 'Price is required',
                                valueAsNumber: true,
                                min: { value: 0.01, message: 'Price must be positive' }
                            })}
                            type='number'
                            step="0.01"
                            placeholder='500.00'
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Stock Quantity</label>
                        <input
                            {...register('quantity', { 
                                required: 'Quantity is required',
                                valueAsNumber: true,
                                min: { value: 1, message: 'Quantity must be at least 1' }
                            })}
                            type='number'
                            placeholder='10'
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Category</label>
                        <input
                            {...register('category')}
                            type='text'
                            placeholder='Fiction, Novel, History'
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                    </div>

                    {/* Status (Dropdown) */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Visibility Status</label>
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-white'
                            defaultValue="published"
                        >
                            <option value="published">Published (Visible on All Books Page)</option>
                            <option value="unpublished">Unpublished (Hidden from All Books Page)</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>
                </div> {/* End grid */}

                {/* Description */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Description</label>
                    <textarea
                        {...register('description')}
                        rows='4'
                        placeholder='Brief description of the book...'
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                    ></textarea>
                </div>

                {/* Book Image */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Book Cover Image</label>
                    <input
                        {...register('image', { required: 'Book Image is required' })}
                        type='file'
                        accept='image/*'
                        className='block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
                    />
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-3 rounded-lg text-white font-semibold 
                    bg-red-600 hover:bg-red-700 transition duration-200'
                >
                    {isSubmitting ? <TbFidgetSpinner className='animate-spin m-auto' /> : "Submit Book"}
                </button>
            </form>
        </div>
    );
};

export default AddBook;