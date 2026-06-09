"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Password rules:
 * - at least 8 characters
 * - 1 letter
 * - 1 number
 * - 1 special character
 */
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_+\-=])[A-Za-z\d@$!%*#?&^()_+\-=]{8,}$/;

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const recaptchaRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ email: "", password: "", general: "" });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    if (!recaptchaToken) {
      setErrors((p) => ({
        ...p,
        general: "Please verify you are not a robot.",
      }));
      return;
    }

    if (!PASSWORD_REGEX.test(formData.password)) {
      setErrors((p) => ({
        ...p,
        password:
          "Password must be at least 8 characters and include 1 letter, 1 number, and 1 special character.",
      }));
      resetRecaptcha();
      return;
    }

    try {
      setLoading(true);

      await register({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        recaptchaToken,
      });

      navigate("/"); // ✅ success
    } catch (err) {
      const apiError = err?.response?.data;

      if (apiError?.type === "AppUser.EmailExists") {
        setErrors((p) => ({
          ...p,
          email: apiError.detail || "Email is already registered.",
        }));
      } else {
        setErrors((p) => ({
          ...p,
          general: apiError?.detail || "Register failed. Please try again.",
        }));
      }

      // 🔐 force reCAPTCHA again on ANY failure
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Join AuctionHub to start bidding
        </p>

        {errors.general && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITEKEY}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};
