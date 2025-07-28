import { Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import UserLayout from "./components/Users/UserLayout";
import LandLordLayout from "./components/LandLord/LandLordLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch } from 'react-redux';
import { syncFromStorage } from './redux/slices/authSlice';
// Pages
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ApartmentDetail from "./pages/Users/ApartmentDetail";
import ProductsList from "./pages/Users/ProductsList";
import BookingForm from "./pages/Users/BookingForm";
import CheckoutPage from "./pages/Users/CheckoutPage";
import UserProfile from "./pages/Users/UserProfile";
import History from "./pages/Users/History";
import RevenueStats from "./pages/Landlord/RevenueStats";
import LandlordDashboard from "./pages/Landlord/LandlordDasboard";
import ApartmentList from "./pages/Landlord/ApartmentList";
import BookingHistory from "./pages/Landlord/BookingHistory";
import Logout from "./pages/Landlord/Logout";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Sync Redux state từ localStorage khi app load
    dispatch(syncFromStorage());
  }, [dispatch]);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected User Routes */}
      <Route element={<PrivateRoute allowedRoles={["User"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/apartmentdetail" element={<ApartmentDetail />} />
          <Route path="/productslist" element={<ProductsList />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/checkoutpage" element={<CheckoutPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Route>

      {/* Protected Landlord Routes */}
      <Route element={<PrivateRoute allowedRoles={["Landlord"]} />}>
        <Route element={<LandLordLayout />}>
          <Route path="/landlorddashboard" element={<LandlordDashboard />} />
          <Route path="/revenue" element={<RevenueStats />} />
          <Route path="/apartments" element={<ApartmentList />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Optional: Unauthorized Page */}
      <Route path="/unauthorized" element={<h2>Không có quyền truy cập</h2>} />
    </Routes>
  );
}

export default App;
