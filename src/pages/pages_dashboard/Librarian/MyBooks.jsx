import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaEdit, FaEyeSlash } from 'react-icons/fa'; // Edit ও Unpublish আইকন

const MyBooks = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const librarianEmail = user?.email;

    //  React Query ব্যবহার করে এই লাইব্রেরিয়ানের বইগুলো লোড করা
    // সার্ভার রাউট: GET /my-inventory/:email
    const { 
        data: books = [], 
        isLoading, 
        refetch 
    } = useQuery({
        queryKey: ['myBooks', librarianEmail],
        enabled: !loading && !!librarianEmail,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-inventory/${librarianEmail}`);
            return res.data;
        }
    });

    //  বইয়ের স্ট্যাটাস (Published/Unpublished) পরিবর্তন করার হ্যান্ডলার
    const handleToggleStatus = (bookId, currentStatus, bookName) => {
        const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
        const actionText = newStatus === 'unpublished' ? 'Unpublish' : 'Publish';

        Swal.fire({
            title: `Are you sure?`,
            text: `You are about to ${actionText} the book: "${bookName}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, ${actionText} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার সাইডে বই আপডেট করার জন্য PATCH রিকোয়েস্ট (index.js এ এটি পরে যোগ করা হবে)
                    const res = await axiosSecure.patch(`/books/${bookId}`, { 
                        status: newStatus 
                    });
                    
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            title: 'Status Updated!',
                            text: `"${bookName}" is now ${newStatus.toUpperCase()}.`,
                            icon: 'success'
                        });
                        refetch(); // তালিকা আপডেট করা
                    }
                } catch (error) {
                    console.error("Status Update Error:", error);
                    Swal.fire('Error', 'Failed to update book status.', 'error');
                }
            }
        });
    };


    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    // বই ডিলিট করার অপশন না থাকায়, শুধু স্ট্যাটাস টগল রাখা হলো।
    // ডিলিট করার জন্য AdminDashboard/ManageBooks পেজ ব্যবহার হবে।

    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold mb-8 text-center text-red-700'>
                📚 My Books ({books.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    {/* Table head */}
                    <thead className='bg-red-100 text-red-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Book Name</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={book.image} alt={book.name} />
                                        </div>
                                    </div>
                                </td>
                                <td className='font-semibold'>{book.name}</td>
                                <td>{book.author}</td>
                                <td>{book.price} BDT</td>
                                <td>{book.quantity}</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        book.status === 'published' ? 'bg-green-500 text-white' : 
                                        'bg-red-500 text-white'
                                    }`}>
                                        {book.status?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className='flex space-x-2 pt-4'>
                                    {/* Edit Button: EditBook রাউটে নিয়ে যাবে */}
                                    <Link 
                                        to={`/dashboard/edit-book/${book._id}`} 
                                        className="btn btn-sm btn-info text-white"
                                    >
                                        <FaEdit /> Edit
                                    </Link>

                                    {/* Toggle Status Button */}
                                    <button 
                                        onClick={() => handleToggleStatus(book._id, book.status, book.name)}
                                        className={`btn btn-sm ${book.status === 'published' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white border-0`}
                                    >
                                        <FaEyeSlash /> {book.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBooks;