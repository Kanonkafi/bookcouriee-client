import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import AllBooks from "../pages/Books/AllBooks";
import BookDetails from "../pages/Books/BookDetails";

// Auth
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";

// User Dashboard Pages
import UserOrders from "../pages/pages_dashboard/User/MyOrders";
import UserProfile from "../pages/pages_dashboard/User/MyProfile";
import UserInvoices from "../pages/pages_dashboard/User/Invoices";
import Wishlist from "../pages/pages_dashboard/User/Wishlist";

// Librarian Dashboard
import AddBook from "../pages/pages_dashboard/Librarian/AddBook";
import MyBooks from "../pages/pages_dashboard/Librarian/MyBooks";
import ManageOrders from "../pages/pages_dashboard/Librarian/ManageOrders";

// Admin Dashboard
import AllUsers from "../pages/pages_dashboard/Admin/AllUsers";
import ManageBooks from "../pages/pages_dashboard/Admin/ManageBooks";

// middleware
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import LibrarianRoute from "./LibrarianRoute";

export const router = createBrowserRouter([
  // ===============================
  // Main Layout
  // ===============================
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <AllBooks /> },
      { path: "/book/:id", element: <BookDetails /> },
    ],
  },

  // ===============================
  // Auth Routes
  // ===============================
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },

  // ===============================
  // Dashboard Layout (Protected)
  // ===============================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ----- User Dashboard -----
      { index: true, element: <UserOrders /> },

      { path: "my-orders", element: <UserOrders /> },
      { path: "my-profile", element: <UserProfile /> },
      { path: "invoices", element: <UserInvoices /> },
      { path: "wishlist", element: <Wishlist /> },

      // ----- Librarian Dashboard -----
      {
        path: "add-book",
        element: (
          <LibrarianRoute>
            <AddBook />
          </LibrarianRoute>
        ),
      },
      {
        path: "my-books",
        element: (
          <LibrarianRoute>
            <MyBooks />
          </LibrarianRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <LibrarianRoute>
            <ManageOrders />
          </LibrarianRoute>
        ),
      },

      // ----- Admin Dashboard -----
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-books",
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        ),
      },
    ],
  },
]);
