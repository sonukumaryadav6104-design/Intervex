import { createPortal } from "react-dom";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModal({ onClose }) {
  const userData = useSelector((state) => state?.user?.userData);
  const modalRef = useRef(null);

  // Auto close after login
  useEffect(() => {
    if (userData) onClose();
  }, [userData, onClose]);

  // Escape key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Click outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-[#111827] rounded-2xl shadow-xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <FaTimes size={18} />
        </button>

        <Auth isModal={true} />
      </div>
    </div>,
    document.body
  );
}

export default AuthModal;