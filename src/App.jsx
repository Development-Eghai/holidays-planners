import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Trips from "./pages/Trips/TripDetails";
import TripList from "./pages/Trips/TripList";
import Destinations from "./pages/Destinations/Destinations";
import DestinationList from "./pages/Destinations/DestinationList";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/contact";
import About from "./pages/About/About";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import Honeymoon from "./pages/Category/Honeymoon/HoneymoonDetails";
import Office from "./pages/Category/Office/OfficeDetails";
import Family from "./pages/Category/Family/FamilyDetails";

// --- New Admin Imports ---
import AdminLogin from "./pages/admin/AdminLogin";
// Import the minimal placeholder to prevent dependency hell for now
import AdminDashboard from "./pages/admin/AdminDashboard"; 
// --- End New Admin Imports ---

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