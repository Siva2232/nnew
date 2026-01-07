import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import the new Footer

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      {/* Navbar handles Menu, Cart, Order Summary */}
      <Navbar title="MY CAFE" />

      {/* Main content expands to push footer down */}
      <main className="pt-4 flex-grow">
        <Outlet />
      </main>

      {/* The Great UI Footer */}
      <div className="top-0">
      <Footer />
    </div>
    </div>
  );
}