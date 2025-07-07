import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Users/UserLayout";
import ApartmentDetail from "./pages/Users/ApartmentDetail";
import ProductsList from "./pages/Users/ProductsList";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import BookingForm from "./pages/Users/BookingForm";
import CheckoutPage from "./pages/Users/CheckoutPage";
import UserProfile from "./pages/Users/UserProfile";
import History from "./pages/Users/History";
import RevenueStats from "./pages/Landlord/RevenueStats";
import LandLordLayout from "./components/LandLord/LandLordLayout";
import LandlordDashboard from "./pages/Landlord/LandlordDasboard";
import ApartmentList from "./pages/Landlord/ApartmentList";
import BookingHistory from "./pages/Landlord/BookingHistory";
import Logout from "./pages/Landlord/Logout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route element={<UserLayout />}>
        <Route path="/apartmentdetail" element={<ApartmentDetail />} />
        <Route path="/productslist" element={<ProductsList/>}/>
        <Route path="/booking-form" element={<BookingForm/>}/>
        <Route path="/checkoutpage" element={<CheckoutPage/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/history" element={<History/>}/>
        
      </Route>
      <Route element={<LandLordLayout/>}>
      <Route path="/apartmentlist" element={<ApartmentList/>}/>
       <Route path="/revenuestats" element={<RevenueStats/>}/>
       <Route path="/landlorddashboard" element={<LandlordDashboard/>}/>
       <Route path="/bookinghistory" element={<BookingHistory/>}/>
       <Route path="/logout" element={<Logout/>}/>
      </Route>
    </Routes>
  );
}

export default App;