import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const NavBar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out");
        navigate("/");
      })
      .catch(console.error);
  };

  useEffect(() => {
    const listener = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, []);

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "text-gray-600 dark:text-gray-300 hover:text-indigo-500")}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/books" className={({ isActive }) => (isActive ? "active" : "text-gray-600 dark:text-gray-300 hover:text-indigo-500")}>Books</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "text-gray-600 dark:text-gray-300 hover:text-indigo-500")}>Dashboard</NavLink>
        </li>
      )}
    </>
  );

  if (loading) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl mt-4 backdrop-blur-md z-50">
      <div className="w-full flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">BookCourier</Link>

        <ul className="hidden md:flex space-x-6 font-medium">{navLinks}</ul>

        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!user ? (
            <div className="hidden md:flex space-x-2">
              <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:opacity-90 transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:opacity-90 transition">Register</Link>
            </div>
          ) : (
            <div ref={profileRef} className="relative">
              <img onClick={() => setProfileOpen(!profileOpen)} src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"} alt="user" className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-400" />

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white rounded-xl shadow-xl p-4 z-50">
                  <div className="p-3 border-b border-gray-700">
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-sm text-gray-300 truncate">{user.email}</p>
                  </div>

                  <Link to="/dashboard/my-profile" className="block mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-center">My Profile</Link>
                  <button onClick={handleLogout} className="w-full mt-2 px-4 py-2 rounded-lg bg-purple-600 hover:opacity-95 transition">Logout</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 space-y-3">
          <ul className="flex flex-col space-y-2 font-medium">{navLinks}</ul>

          {!user ? (
            <div className="flex flex-col space-y-2 mt-4">
              <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-center font-semibold">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-purple-500 text-white text-center font-semibold">Register</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full mt-3 py-2 text-red-500 border border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
