import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Users/UserLayout";
import ApartmentDetail from "./pages/Users/ApartmentDetail";
import ProductsList from "./pages/Users/ProductsList";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import BookingForm from "./pages/Users/BookingForm";
import CheckoutPage from "./pages/Users/CheckoutPage";

// import các trang khác...

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route element={<UserLayout />}>
        <Route path="/apartment" element={<ApartmentDetail />} />
        <Route path="/productslist" element={<ProductsList/>}/>
        <Route path="/booking-form" element={<BookingForm/>}/>
        <Route path="/checkoutpage" element={<CheckoutPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;