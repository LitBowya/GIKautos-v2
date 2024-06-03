import React from "react";
import ReactDOM from "react-dom/client";
import "util";
import "os-browserify";
import "path-browserify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PrivateRoute from "./components/Private Route/PrivateRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute.jsx";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import OrderListPage from "./pages/Admin/OrderListPage.jsx";
import ProductListPage from "./pages/Admin/ProductListPage.jsx";
import ProductEditPage from "./pages/Admin/ProductEditPage.jsx";
import UserListPage from "./pages/Admin/UserListPage.jsx";
import UserEditPage from "./pages/Admin/UserEditPage.jsx";
import ChatPage from "./pages/Chatpage.jsx";
import ProductByCategoryPage from "./pages/ProductByCategoryPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import SearchBox from "./components/Search/SearchBox.jsx";
import MechanicHomepage from "./pages/Mechanic/MechanicHomepage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/search/:keyword" element={<HomePage />} />
      <Route path="/page/:pageNumber" element={<HomePage />} />
      <Route path="/category/:category" element={<ProductByCategoryPage />} />
      <Route path="/search" element={<SearchBox />} />
      <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop" element={<ShopPage />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/mechanic" element={<MechanicHomepage />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListPage />} />
        <Route path="/admin/productlist" element={<ProductListPage />} />
        <Route path="/admin/userlist" element={<UserListPage />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
        <Route
          path="/admin/productlist/:pageNumber"
          element={<ProductListPage />}
        />
        <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
