"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toast() {
  return (
    <div className="pointer-events-none relative z-[100000]">
      <ToastContainer
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss={false}
        newestOnTop
        toastClassName="pointer-events-auto cursor-pointer"
        style={{ zIndex: 100000 }}
      />
    </div>
  );
}
