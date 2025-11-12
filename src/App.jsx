import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// --- PUBLIC PAGES ---
import Home from "./pages/user/Home/Home";
import TripList from "./pages/user/Trips/TripList";
import TripDetails from "./pages/user/Trips/TripDetails";
import Destinations from "./pages/user/Destinations/Destinations";
import DestinationList from "./pages/user/Destinations/DestinationList";
import Honeymoon from "./pages/user/Category/Honeymoon/HoneymoonDetails";
import Office from "./pages/user/Category/Office/OfficeDetails";
import Family from "./pages/user/Category/Family/FamilyDetails";
import Blog from "./pages/user/Blog/Blog";
import Contact from "./pages/user/Contact/contact";
import About from "./pages/user/About/About";
import Terms from "./pages/user/Terms/Terms";
import Privacy from "./pages/user/Privacy/Privacy";
import CategoryDetails from "./pages/user/Category/CategoryPreview";

// --- ADMIN PAGES & PROTECTED ROUTE COMPONENT ---
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./pages/admin/components/PrivateRoute";

export default function App() {
  // Hide Header & Footer for Admin pages
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <>
      {/* Header (Public Only) */}
      {!isAdminRoute && <Header />}

      <main className="pt-0">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />

          {/* TRIPS */}
          <Route path="/triplist" element={<TripList />} />
          <Route path="/trips" element={<TripDetails />} />
          <Route path="/trip-preview/:slug/:id" element={<TripDetails />} />

          {/* DESTINATIONS */}
          <Route path="/destinations" element={<DestinationList />} />
          <Route path="/destination/:slug/:id" element={<Destinations />} />
          <Route path="/destinfo" element={<Destinations />} />

          {/* CATEGORY ROUTES */}
          <Route path="/destinfo/honeymoon" element={<Honeymoon />} />
          <Route path="/destinfo/office" element={<Office />} />
          <Route path="/destinfo/family" element={<Family />} />
          <Route path="/category/:slug/:id" element={<CategoryDetails />} />

          {/* BLOG & STATIC PAGES */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
    
          {/* --- ADMIN ROUTES --- */}
          
          {/* 1. Admin Login Page (Publicly accessible) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* 2. Base /admin path redirects directly to the login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* 3. Protected Dashboard Routes - All admin routes inside PrivateRoute */}
          <Route element={<PrivateRoute />}>
            {/* The AdminDashboard component handles all nested routes */}
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </main>

      {/* Footer (Public Only) */}
      {!isAdminRoute && <Footer />}
    </>
  );
}