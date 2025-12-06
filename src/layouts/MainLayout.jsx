import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";


const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/error"; //  error page footer hide 

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="w-11/12 max-w-7xl mx-auto">
        <NavBar />
      </div>

      {/*  Page Content */}
      <div className="flex-grow w-11/12 max-w-7xl mx-auto mt-6">
        <Outlet />
      </div>

      {/*  Footer */}
      {!hideFooter && (
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          <Footer />
        </div>

      )}
     
    </div>
  );
};

export default MainLayout;
