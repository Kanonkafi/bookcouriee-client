import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; 
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const ManageBooks = () => {
    const axiosSecure = useAxiosSecure();

    // 🔑 সব বই লোড করা
    const { 
        data: books = [], 
        isLoading, 
        refetch 
    } = useQuery({
        queryKey: ['adminAllBooks'],
        queryFn: async () => {
            // সার্ভার রাউট: GET /admin/manage-books
            const res = await axiosSecure.get('/admin/manage-books');
            return res.data;
        }
    });

    // 🔑 বইয়ের স্ট্যাটাস পরিবর্তন (Publish/Unpublish)
    const handleUpdateStatus = (book, newStatus) => {
        Swal.fire({
            title: `Set book to ${newStatus.toUpperCase()}?`,
            text: `Book: ${book.name}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newStatus.toUpperCase()}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার রাউট: PATCH /admin/books/status/:id
                    const res = await axiosSecure.patch(`/admin/books/status/${book._id}`, { status: newStatus });
                    
                    if (res.data.modifiedCount > 0) {
                        toast.success(`'${book.name}' status updated to ${newStatus}!`);
                        refetch(); 
                    }
                } catch (error) {
                    toast.error('Failed to update book status.');
                    console.log(error);
                }
            }
        });
    };

    // 🔑 বই ডিলিট করা এবং সংশ্লিষ্ট অর্ডার ডিলিট করা
    const handleDeleteBook = (book) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to DELETE "${book.name}". All associated orders will also be deleted.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // সার্ভার রাউট: DELETE /admin/books/:id
                    const res = await axiosSecure.delete(`/admin/books/${book._id}`);
                    
                    if (res.data.deletedBookCount > 0) {
                        toast.success(`'${book.name}' deleted. Total orders deleted: ${res.data.deletedOrdersCount}`);
                        refetch();
                    } else {
                        toast.error("Failed to delete book.");
                    }
                } catch (error) {
                    toast.error('Error during deletion.');
                    console.log(error);
                }
            }
        });
    };
    

    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    return (
        <div className='p-4 sm:p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-3xl font-bold mb-8 text-center text-indigo-700'>
                📚 Manage All Books ({books.length})
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className='bg-indigo-100 text-indigo-800 uppercase'>
                        <tr>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Librarian</th>
                            <th>Current Status</th>
                            <th>Toggle Publish</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id} className='hover:bg-gray-50'>
                                <th>{index + 1}</th>
                                <td className='font-semibold'>{book.name}</td>
                                <td>{book.librarianEmail}</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        book.status === 'published' ? 'bg-green-500 text-white' : 
                                        'bg-red-500 text-white'
                                    }`}>
                                        {book.status?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                </td>
                                
                                <td>
                                    {book.status === 'published' ? (
                                        <button 
                                            onClick={() => handleUpdateStatus(book, 'unpublished')}
                                            className='btn btn-sm btn-error text-white'
                                        >
                                            <FaToggleOn /> Unpublish
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleUpdateStatus(book, 'published')}
                                            className='btn btn-sm btn-success text-white'
                                        >
                                            <FaToggleOff /> Publish
                                        </button>
                                    )}
                                </td>

                                <td>
                                    <button 
                                        onClick={() => handleDeleteBook(book)}
                                        className='btn btn-sm btn-error text-white'
                                    >
                                        <FaTrashAlt />
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

export default ManageBooks;