import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CustomerLayout() {
  return (
    <>
      {/* Navbar handles Menu, Cart, Order Summary */}
      <Navbar title="AKSHAYUDE KADA" />

      <main className="pt-4">
        <Outlet />
      </main>
    </>
  );
}
