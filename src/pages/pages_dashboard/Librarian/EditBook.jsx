

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
//  Note: ইমেজ আপলোড করার পর ইমেজ পরিবর্তন না করলে পুনরায় আপলোডের দরকার নেই

const EditBook = () => {
    const { id } = useParams(); // URL থেকে বুক আইডি নেওয়া
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting },   } = useForm();

    // 🔑 বর্তমানে থাকা বইয়ের ডেটা লোড করা
    const { data: bookData, isLoading } = useQuery({
        queryKey: ['singleBook', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/books/${id}`); // সার্ভার রাউট GET /books/:id
            return res.data;
        }
    });

    // 🔑 ফর্ম সাবমিট হ্যান্ডলার (বই আপডেট)
    const onSubmit = async (data) => {
        const toastId = toast.loading('Updating Book...');
        
        try {
            // বইয়ের ডেটা তৈরি (ইমেজ ফাইল হ্যান্ডলিং আপাতত স্কিপ করা হয়েছে, কারণ ImageUpload বেশ জটিল,
            // সাধারণত Edit ফর্মে ইমেজ পরিবর্তন ঐচ্ছিক থাকে)

            const updatedBook = {
                name: data.name,
                author: data.author,
                price: parseFloat(data.price),
                status: data.status,
                description: data.description,
                quantity: parseInt(data.quantity),
                category: data.category,
                // image: bookData.image, // ইমেজ পরিবর্তন না হলে আগেরটিই থাকবে
                updatedAt: new Date(),
            };

            // সার্ভারে PATCH রিকোয়েস্ট পাঠানো (index.js এ যোগ করা হবে)
            const response = await axiosSecure.patch(`/books/${id}`, updatedBook);

            if (response.data.modifiedCount > 0) {
                toast.success('Book Updated Successfully!', { id: toastId });
                navigate('/dashboard/my-books'); 
            } else {
                 toast.error('No changes made or update failed.', { id: toastId });
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error updating book.', { id: toastId });
        }
    };

    if (isLoading) {
        return <div className='flex justify-center items-center h-screen'><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (!bookData) {
        return <div className='text-center text-red-500 mt-20'>Book not found!</div>;
    }

    // 💡 Form লোড হওয়ার পর default values সেট করার জন্য useEffect বা defaultValue ব্যবহার করুন
    const defaultValues = {
        name: bookData.name || '',
        author: bookData.author || '',
        price: bookData.price || 0,
        quantity: bookData.quantity || 1,
        category: bookData.category || '',
        status: bookData.status || 'published',
        description: bookData.description || ''
    };


    return (
        <div className='max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-lg my-10'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                ✏️ Edit Book: {bookData.name}
            </h2>
            
            {/* 🔑 Default Values দিয়ে ফর্ম লোড করা হয়েছে */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    
                    {/* Book Name */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Book Name</label>
                        <input
                            {...register('name', { required: 'Book Name is required' })}
                            type='text'
                            defaultValue={defaultValues.name}
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
                            defaultValue={defaultValues.author}
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
                            defaultValue={defaultValues.price}
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
                            defaultValue={defaultValues.quantity}
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
                            defaultValue={defaultValues.category}
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                        />
                    </div>

                    {/* Status (Dropdown) */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Visibility Status</label>
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500 bg-white'
                            defaultValue={defaultValues.status}
                        >
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
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
                        defaultValue={defaultValues.description}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500'
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-3 rounded-lg text-white font-semibold 
                    bg-blue-600 hover:bg-blue-700 transition duration-200'
                >
                    {isSubmitting ? <TbFidgetSpinner className='animate-spin m-auto' /> : "Update Book Details"}
                </button>
            </form>
            
            {/* 🔑 ইমেজ পরিবর্তন করার অপশন এখানে যোগ করা যেতে পারে */}
            <div className='mt-6 text-center'>
                <p className='text-gray-600'>Current Image:</p>
                <img src={bookData.image} alt={bookData.name} className='w-32 h-32 object-cover mx-auto mt-2 rounded-lg shadow-md' />
                <p className='text-sm text-gray-500 mt-2'>Note: Image change requires a separate upload process and is not included in this simple form.</p>
            </div>
        </div>
    );
};

export default EditBook;