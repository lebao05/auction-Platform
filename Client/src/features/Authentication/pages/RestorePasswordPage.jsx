"use client";

import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Mail, Lock, KeyRound, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export const RestorePasswordPage = () => {
    const { forgotPassword, resetPassword, loading } = useAuth();
    const navigate = useNavigate();

    // Step 1: 'request', Step 2: 'reset', Step 3: 'success'
    const [step, setStep] = useState("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);

    /* --- ACTIONS --- */
    console.log(step);
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError(null);

        const ok = await forgotPassword(email);

        if (!ok) {
            setError("Không tìm thấy tài khoản với email này.");
            return;
        }

        setStep("reset");
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);

        const ok = await resetPassword({
            email,
            otp,
            newPassword,
        });

        if (!ok) {
            setError("Mã OTP không đúng hoặc đã hết hạn.");
            return;
        }

        setStep("success");
    };
    console.log(step);
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans">
            {/* Back Button */}
            <button
                onClick={() => (step === "reset" ? setStep("request") : navigate("/signin"))}
                className="absolute top-8 left-8 flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
                <ChevronLeft size={20} />
                {step === "reset" ? "Quay lại nhập email" : "Quay lại đăng nhập"}
            </button>

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">

                {/* Step 1 & 2 Header */}
                {step !== "success" && (
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">
                            {step === "request" ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {step === "request"
                                ? "Nhập email của bạn để nhận mã OTP xác thực."
                                : `Chúng tôi đã gửi mã đến ${email}`}
                        </p>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* --- STEP 1: REQUEST OTP --- */}
                {step === "request" && (
                    <form onSubmit={handleRequestOTP} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Gửi mã xác nhận"}
                        </button>
                    </form>
                )}

                {/* --- STEP 2: RESET PASSWORD --- */}
                {step === "reset" && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Mã OTP</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Nhập 6 số"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Xác nhận đổi mật khẩu"}
                        </button>
                    </form>
                )}

                {/* --- STEP 3: SUCCESS --- */}
                {step === "success" && (
                    <div className="text-center py-4 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thành công!</h2>
                        <p className="text-slate-500 mb-8">
                            Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                        </p>
                        <Link
                            to="/signin"
                            className="inline-block w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};