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
import HomePage from "./features/Home/pages/HomePage";
import AdminPage from "./features/Admin/pages/AdminPage";
import ProductPage from "./features/Product/pages/ProductPage";
import SettingPage from "./features/Profile/pages/SettingPage";
import WishlistPage from "./features/Profile/pages/WishListPage";
import PostProductPage from "./features/ProductManagement/pages/PostProductPage";
import OrderPage from "./features/Order/pages/OrderPage";
import SellerProductsPage from "./features/ProductManagement/pages/SellerProductPage";

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
          // project
          <Route element={<MainLayout />}>
            <Route path="/product" element={<ProductPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/product/create" element={<PostProductPage />} />
          </Route>          
          <Route element={<MainLayout />}>
            <Route path="/product/manage" element={<SellerProductsPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/product/mage" element={<SellerProductsPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/user/wishlist" element={<WishlistPage />} />
          </Route>


          <Route element={<MainLayout />}>
            <Route path="/order" element={<OrderPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/user/setting" element={<SettingPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="admin" element={<AdminPage />}></Route>
        </Routes>

      </Router>
    </>
  );
}

export default App;
