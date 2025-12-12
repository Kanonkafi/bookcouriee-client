// src/components/BookCard.jsx
import { FaUser, FaTag, FaBoxesStacked, FaBookOpen } from "react-icons/fa6"; 
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
const { _id, name, author, price, image, category, description, quantity } = book;

return (
<div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 
    // 🔑 ফিক্স: h-full এবং flex-col দিয়ে উচ্চতা স্থির করা হলো
  h-full flex flex-col 
  ">

{/* BOOK IMAGE */}
<div className="overflow-hidden rounded-xl mb-4">
 <img
 src={image}
 alt={name}
 className="w-full h-56 object-cover group-hover:scale-110 duration-300"
 />
</div>

{/* BADGE - LATEST */}
<span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-full shadow-md animate-pulse">
 LATEST
</span>

    {/* 🔑 ফিক্স: কন্টেন্ট এরিয়াকে ফ্লেক্স গ্রো করতে হবে */}
    <div className="flex-grow">
    
        {/* BOOK NAME (line-clamp-2 ঠিক আছে) */}
        <h3 className="text-xl font-bold dark:text-white mb-2 line-clamp-2 hover:text-indigo-600 duration-200">
        {name}
        </h3>

        {/* AUTHOR */}
        <div className="flex items-center mb-3">
        <p className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-indigo-700 
            bg-indigo-100 border border-indigo-300">
        <FaUser className="text-indigo-500" size={12} /> {author}
        </p>
        </div>

        {/* DESCRIPTION (line-clamp-2 ঠিক আছে) */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {description}
        </p>

        {/* DETAILS & BADGES */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
            
            {/* PRICE BADGE (Gradient Background Badge) */}
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white 
                bg-gradient-to-r from-green-500 to-teal-500 shadow-md">
                <FaTag className="text-white" size={10} />
                ${price}
            </span>

            {/* CATEGORY BADGE (Solid Background Badge) */}
            {category && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white 
                bg-rose-500 shadow-md">
                    <FaBookOpen className="text-white" size={10} />
                    {category}
                </span>
            )}
        
            {/* QUANTITY BADGE (Outline/Soft Background Badge) */}
            {quantity > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-orange-700 
                bg-orange-100 border border-orange-300">
                    <FaBoxesStacked className="text-orange-500" size={10} />
                    {quantity} in Stock
                </span>
            )}
        </div>

    </div> {/* 🔑 flex-grow বন্ধ হলো */}

{/* View Details Button */}
<Link
 to={`/books/${_id}`}
 className="block text-center mt-auto text-sm font-semibold py-2 rounded-xl 
    // 🔑 mt-auto বাটনটিকে সর্বদা নিচে রাখবে
  bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white
  transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.01]"
>
 View Details
</Link>
</div>
);
};

export default BookCard;