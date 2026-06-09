"use client";

import { X, Store, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SellerRequestModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit();
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Store className="h-5 w-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              Đăng ký đăng tin
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition text-gray-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Đăng ký thành công!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất.
              </p>

              <button
                onClick={onClose}
                className="mt-6 rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-yellow-500 transition"
              >
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Terms */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  required
                  id="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-600 underline">
                    Điều khoản & Chính sách
                  </a>{" "}
                  dành cho người bán của AuctionHub.
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-yellow-500 disabled:opacity-70 transition flex items-center gap-2"
                >
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {loading ? "Đang gửi..." : "Đăng ký ngay"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
