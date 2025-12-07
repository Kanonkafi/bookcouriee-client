import { Outlet, NavLink } from "react-router-dom";
import { Menu, X, User, Book, ShoppingCart, Settings, Home } from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Overview", icon: Home },
    { path: "/dashboard/my-orders", label: "My Orders", icon: ShoppingCart },
    { path: "/dashboard/my-profile", label: "My Profile", icon: User },
    { path: "/dashboard/invoices", label: "Invoices", icon: Book },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex">

      {/* SIDEBAR MOBILE BUTTON */}
      <button
        className="md:hidden p-4"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`bg-white dark:bg-gray-900 shadow-xl p-6 fixed md:static inset-y-0 left-0 w-64 z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-transform duration-300`}>

        <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Dashboard
        </h2>

        <ul className="space-y-4">
          {navItems.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg font-medium transition
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

      </aside>

      {/* CONTENT AREA */}
      <main className="flex-grow p-6 md:ml-0 ml-0 mt-4 md:mt-0 w-full">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;
