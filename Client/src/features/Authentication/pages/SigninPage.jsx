// src/pages/SigninPage.tsx
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  if (user)
    navigate("/");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>{" "}
        <button
          onClick={() => navigate(-1)} // go back to previous page
          className="absolute top-4 left-4 text-gray-500 text-3xl cursor-pointer  hover:text-black"
        >
          ← Back
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer py-2 flex items-center justify-center gap-2
    bg-blue-500 text-white font-semibold rounded-lg
    hover:bg-blue-600 transition-colors
    disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>
        {/* Signup Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
