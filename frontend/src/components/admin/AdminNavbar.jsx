import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { Bell, Search, LogOut } from "lucide-react";

const AdminNavbar = () => {
  return (
    <header className="h-16 bg-[#111827] border-b border-white/10 flex items-center justify-between px-6 md:px-10">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="QuickShow" className="h-9" />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm px-2 text-white placeholder-gray-500"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500"></span>
        </button>

        {/* Admin */}
        <div className="flex items-center gap-3">
          <img
            src={assets.profile}
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-pink-500"
          />

          <div className="hidden md:block">
            <p className="text-white font-medium">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 rounded-lg hover:bg-red-500/20 transition">
          <LogOut className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;