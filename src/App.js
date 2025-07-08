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
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHeader from "./pages/Admin/AdminHeader";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import NavigationTabs from "./pages/Admin/NavigationTabs";
import PostsTable from "./pages/Admin/PostsTable";
import SearchAndFilter from "./pages/Admin/SearchAndFilter";
import StatusBadge from "./pages/Admin/StatusBadge";
import UsersTable from "./pages/Admin/UserTable";
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

      <Route element={<AdminLayout/>}>
        <Route path="/adminheader" element={<AdminHeader/>}/>
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        <Route path="/navigationtabs" element={<NavigationTabs/>}/>
        <Route path="/poststable" element={<PostsTable/>}/>
        <Route path="/searchandfilter" element={<SearchAndFilter/>}/>
        <Route path="/statusbadge" element={<StatusBadge/>}/>
        <Route path="/usertable" element={<UsersTable/>}/>
      </Route>
    </Routes>
  );
}

export default App;