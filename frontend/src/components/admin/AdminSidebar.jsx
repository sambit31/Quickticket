import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboard,
  PlusSquare,
  List,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };

  const adminNavLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Add Shows",
      path: "/admin/add-shows",
      icon: PlusSquare,
    },
    {
      name: "List Shows",
      path: "/admin/list-shows",
      icon: List,
    },
    {
      name: "Bookings",
      path: "/admin/list-bookings",
      icon: ClipboardList,
    },
  ];

  return (
    <aside className="w-72 min-h-screen  border-r border-white/10 flex flex-col">

      {/* Profile */}
      <div className="flex flex-col items-center py-8 border-b border-white/10">
        <img
          src={user.imageUrl}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-pink-500 shadow-lg"
        />

        <h2 className="mt-4 text-lg font-semibold text-white">
          {user.firstName} {user.lastName}
        </h2>

        <p className="text-sm text-gray-400">
          Administrator
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">
        {adminNavLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-pink-600 text-white shadow-lg"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white"></span>
                )}

                <link.icon className="w-5 h-5" />

                <span className="font-medium">
                  {link.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-5">
        <p className="text-center text-xs text-gray-500">
          QuickShow Admin Panel
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;