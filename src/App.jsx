import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
// --- UPDATED PUBLIC IMPORTS ---
import Home from "./pages/user/Home/Home";
import Trips from "./pages/user/Trips/TripDetails";
import TripList from "./pages/user/Trips/TripList";
import Destinations from "./pages/user/Destinations/Destinations";
import DestinationList from "./pages/user/Destinations/DestinationList";
import Blog from "./pages/user/Blog/Blog";
import Contact from "./pages/user/Contact/contact";
import About from "./pages/user/About/About";
import Terms from "./pages/user/Terms/Terms";
import Privacy from "./pages/user/Privacy/Privacy";
import Honeymoon from "./pages/user/Category/Honeymoon/HoneymoonDetails";
import Office from "./pages/user/Category/Office/OfficeDetails";
import Family from "./pages/user/Category/Family/FamilyDetails";
import TripDetails from "./pages/user/Trips/TripDetails";

// --- ADMIN IMPORTS (Path remains the same) ---
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard"; 
// --- End Admin Imports ---

export default function App() {
  // Check if the current path starts with '/admin' to hide public header/footer
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <>
      {/* Conditionally render Header for public site */}
      {!isAdminRoute && <Header />}
      
      <main className="pt-0">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} /> 
          <Route path="/triplist" element={<TripList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/destinations" element={<DestinationList />} />
          <Route path="/destinfo" element={<Destinations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/destinfo/honeymoon" element={<Honeymoon />} />
          <Route path="/destinfo/office" element="/destinfo/office" />
          <Route path="/destinfo/family" element={<Family />} />
          <Route path="/trip-preview/:slug/:id" element={<TripDetails />} />


          {/* --- ADMIN ROUTES --- */}
          {/* 1. Login Page Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* 2. Dashboard Placeholder Route (handles redirect from login) */}
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} /> 
        </Routes>
      </main>
      
      {/* Conditionally render Footer for public site */}
      {!isAdminRoute && <Footer />}
    </>
  );
}