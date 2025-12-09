// src/pages/AllBooks.jsx

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import BookCard from '../../components/BookCard'; 
import { FaSearch, FaSortAmountDown, FaFilter } from 'react-icons/fa';
import AOS from 'aos';

import axios from "axios";


const AllBooks = () => {
  
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
   // const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // 'asc', 'desc', 'none'

    // 1. Data Fetching
    const { data: allBooks = [], isLoading } = useQuery({
        queryKey: ['allBooks'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/books`);
            return res.data;
        },
    });

    // 2. Search and Sort Logic (Client-Side Filtering)
    const filteredAndSortedBooks = useMemo(() => {
        let currentBooks = [...allBooks]; // ডেটার ক্লোন

        // a. Search Filter (by Book Name)
        if (searchTerm) {
            currentBooks = currentBooks.filter(book => 
                book.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // b. Sort (by Price)
        if (sortOrder !== 'none') {
            currentBooks.sort((a, b) => {
                const priceA = parseFloat(a.price);
                const priceB = parseFloat(b.price);
                
                if (sortOrder === 'asc') {
                    return priceA - priceB;
                } else if (sortOrder === 'desc') {
                    return priceB - priceA;
                }
                return 0;
            });
        }
        
        return currentBooks;
    }, [allBooks, searchTerm, sortOrder]);

    // Handlers
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    if (isLoading) {
        return <div className="text-center py-20 text-xl dark:text-gray-300">Loading All Books...</div>;
    }


    return (
        <div className="py-16 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                
                {/* HEADING */}
                <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white 
                               bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent tracking-tight"
                    data-aos="fade-down"
                >
                    📖 Our Full Collection ({filteredAndSortedBooks.length})
                </h2>
                <p className="text-center mb-12 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Browse all available books. Use the search bar to find a specific title or sort by price.
                </p>

                {/* FILTER & SEARCH BAR */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 p-5 rounded-xl shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700" data-aos="fade-up">
                    
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by Book Name..."
                            className="input input-bordered w-full pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative flex items-center gap-2 md:w-56">
                        <FaFilter className="text-indigo-500" />
                        <select
                            className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={sortOrder}
                            onChange={handleSortChange}
                        >
                            <option value="none" disabled>Sort By Price</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>


                {/* BOOKS GRID */}
                {filteredAndSortedBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredAndSortedBooks.map((book, index) => (
                            <div key={book._id} data-aos="fade-up" data-aos-delay={index * 50}>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-2xl text-red-500 dark:text-red-400">
                        No books found matching your criteria.
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default AllBooks;