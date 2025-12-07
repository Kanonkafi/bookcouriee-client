import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 rounded-2xl p-10">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">BookCourier</h2>
          <p className="text-sm leading-relaxed">
            A fast, smart and modern bookstore management system.  
            Find books, order instantly and track everything from your dashboard.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/books" className="hover:text-white">Books</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p>Email: support@bookcourier.com</p>
          <p>Phone: 017XXXXXXXX</p>
          <p>Address: Dhaka, Bangladesh</p>
        </div>

      </div>

      {/* Bottom line */}
      <div className="text-center text-sm text-gray-400 border-t border-gray-700 mt-8 pt-4">
        © {new Date().getFullYear()} BookCourier — All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;
