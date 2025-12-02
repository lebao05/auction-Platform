import { X, Store, Phone, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export function SellerRequestModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            // Close modal after showing success message for 2 seconds
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">

            {/* Modal Content */}
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-100 p-2 rounded-full">
                            <Store className="h-5 w-5 text-yellow-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">Đăng ký đăng tin</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-200 transition text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Đăng ký thành công!</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

             

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" /> Mô tả gian hàng
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Bạn dự định bán sản phẩm gì?"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100 transition resize-none"
                                />
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-2 pt-2">
                                <input
                                    required
                                    id="terms"
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                                    Tôi đồng ý với <a href="#" className="text-blue-600 underline">Điều khoản & Chính sách</a> dành cho người bán của AuctionHub.
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-yellow-500 disabled:opacity-70 transition flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...
                                        </>
                                    ) : (
                                        "Đăng ký ngay"
                                    )}
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}