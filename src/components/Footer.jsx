import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // যদি ফুটার থেকে কোনো লিংকে যেতে চান

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Company Info Section */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {/*  HomeNest Logo/Icon */}
            <span className="text-purple-400 text-3xl "></span> 
            <span>HomeNest</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Discover your ideal living space with HomeNest, where comfort meets convenience.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">About Us</Link></li>
            <li><Link to="/properties" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Properties</Link></li>
            <li><Link to="/services" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Our Services</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm text-gray-400">
              <FaMapMarkerAlt className="text-purple-400" />
              <span>123 Dream Street, City, Country</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-400">
              <FaPhone className="text-purple-400" />
              <span>+880 1234 567890</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-400">
              <FaEnvelope className="text-purple-400" />
              <span>info@homenest.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Newsletter</h3>
          <p className="text-sm text-gray-400">Stay updated with our latest listings and offers.</p>
          <div className="flex mt-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="p-3 rounded-l-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full" 
            />
            <button className="p-3 bg-purple-600 rounded-r-md text-white font-semibold hover:bg-purple-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HomeNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;