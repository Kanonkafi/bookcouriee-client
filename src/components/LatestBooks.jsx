
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BookCard from "./BookCard";


const LatestBooks = () => {

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Latest 6 books load korbe
const { data: latestBooks = [], isLoading } = useQuery({
 queryKey: ["latest-books"],
 queryFn: async () => {
// .env ভেরিয়েবল ব্যবহার
 const res = await axios.get(`${API_URL}/latest-books`);
 console.log("LATEST BOOKS DATA --->", res.data);
 return res.data;
},
 });

 if (isLoading) return <p className="text-center mt-10">Loading...</p>;
if (!latestBooks || latestBooks.length === 0) return <p className="text-center mt-10 text-gray-500">No latest books found.</p>;

return (
<section className="mt-20">
 {/* section heading */}
 <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">
 ✨ Most Recent Books
</h2>

{/* card grid: এখন এখানে BookCard ব্যবহার করা হবে */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
 {latestBooks.map((book) => (
            // ✅ এখানে BookCard কম্পোনেন্ট ব্যবহার করা হচ্ছে
 <BookCard key={book._id} book={book} /> 
 ))}
</div>
</section>
 );
};

export default LatestBooks;