import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Signin } from "./features/Authentication/pages/SigninPage";
import { Signup } from "./features/Authentication/pages/SignupPage";
import ProfilePage from "./features/Profile/pages/ProfilePage";
import { Header } from "./components/layout/Header";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {" "}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          {/* Redirect unknown routes to home */}
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>{" "}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Routes></Routes>
      </Router>{" "}
    </>
  );
}

export default App;
