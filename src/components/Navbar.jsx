import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-base-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">BC</div>
          <span className="font-semibold text-lg">BookCourier</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/dashboard">Dashboard</Link>
          {!user ? (
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
          ) : (
            <>
              <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full"/>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
            </>
          )}
          <button className="btn btn-ghost"><FaSun /></button>
        </div>

        <div className="md:hidden">
          <button className="btn btn-ghost"><FaBars /></button>
        </div>
      </div>
    </nav>
  );
}
