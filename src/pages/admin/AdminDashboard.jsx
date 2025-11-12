import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';

// --- MODULE IMPORTS ---
import TripCreate from './modules/TripManagement/TripCreate';
import TripList from './modules/TripManagement/TripList';
import CategoryList from './modules/Categories/CategoryList';
import DestinationCreate from './modules/Destinations/DestinationCreate';
import DestinationList from './modules/Destinations/DestinationList';
import ActivityList from './modules/Activities/ActivityList';
import LeadManagement from './modules/LeadMangement/LeadManagement';
// --- END IMPORTS ---

// --- PLACEHOLDER COMPONENTS ---
const ModulePlaceholder = ({ name }) => (
  <div className="luxury-card p-8 min-h-[500px] flex flex-col items-center justify-center mt-6">
    <h1 className="text-3xl font-bold text-blue-600">Admin Module: {name}</h1>
  </div>
);

const DestinationType = () => <ModulePlaceholder name="Destination Type Management" />;
const QuotationManagement = () => <ModulePlaceholder name="Quotation Management Panel" />;
const InvoiceManagement = () => <ModulePlaceholder name="Invoice Management Panel" />;
const BookingManagement = () => <ModulePlaceholder name="Booking Management Panel" />;
const PageBuilder = () => <ModulePlaceholder name="Page Builder Interface" />;
const SettingsPage = () => <ModulePlaceholder name="Settings" />;
// --- END PLACEHOLDERS ---

import './css/AdminGlobal.css';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // --- ACCESS CONTROL CHECK ---
  const adminApiKey = localStorage.getItem('admin_api_key');
  if (!adminApiKey) return <Navigate to="/admin/login" replace />;
  // --- END ACCESS CONTROL CHECK ---

  useEffect(() => {
    document.body.classList.remove('admin-login-body');
    document.body.classList.add('admin-dashboard-body');
    return () => {
      document.body.classList.remove('admin-dashboard-body');
    };
  }, []);

  const contentMargin = isSidebarOpen ? '280px' : '80px';

  const handleLogout = () => {
    localStorage.removeItem('admin_api_key');
    window.location.replace('/admin/login');
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      {/* --- HEADER --- */}
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="dashboard-content" style={{ marginLeft: contentMargin }}>
        <div className="dashboard-inner-content">
          <Routes>
            {/* --- OVERVIEW --- */}
            <Route path="overview" element={<DashboardOverview />} />

            {/* --- TRIP MANAGEMENT --- */}
            <Route path="trip-management/list" element={<TripList />} />
            <Route path="trip-management/create" element={<TripCreate />} />
            <Route path="trip-management/create/:id" element={<TripCreate />} />

            {/* --- DESTINATIONS --- */}
            <Route path="add-destination" element={<DestinationList />} />
            <Route path="destination-create" element={<DestinationCreate />} />
            <Route path="destination-create/:id" element={<DestinationCreate />} />

            {/* --- CATEGORIES --- */}
            <Route path="add-categories" element={<CategoryList />} />

            {/* --- ACTIVITIES --- */}
            <Route path="add-activity" element={<ActivityList />} />

            {/* --- LEAD MANAGEMENT --- */}
            <Route path="lead-management" element={<LeadManagement />} />

            {/* --- OTHER MODULES --- */}
            <Route path="destination-type" element={<DestinationType />} />
            <Route path="quotation-management" element={<QuotationManagement />} />
            <Route path="invoice-management" element={<InvoiceManagement />} />
            <Route path="manage-bookings" element={<BookingManagement />} />
            <Route path="page-builder" element={<PageBuilder />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* --- DEFAULT ROUTE --- */}
            <Route index element={<DashboardOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}