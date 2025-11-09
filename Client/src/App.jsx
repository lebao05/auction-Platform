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
import { MainLayout } from "./components/layout/MainLayout";
import SearchPage from "./features/Home/pages/SearchPage";
import CategoryPage from "./features/Home/pages/CategoryPage";
import HomePage from "./features/Home/pages/HomePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/search" element={<SearchPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
