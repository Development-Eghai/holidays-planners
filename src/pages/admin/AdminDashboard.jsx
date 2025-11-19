import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';

// Modules
import TripCreate from './modules/TripManagement/TripCreate';
import TripList from './modules/TripManagement/TripList';
import CategoryList from './modules/Categories/CategoryList';
import DestinationCreate from './modules/Destinations/DestinationCreate';
import DestinationList from './modules/Destinations/DestinationList';
import ActivityList from './modules/Activities/ActivityList';
import LeadManagement from './modules/LeadMangement/LeadManagement';
import LeadTrash from './modules/LeadMangement/LeadTrash';

// Quotations
import QuotationManagement from './modules/QuotationManagement/QuotationManagement';
import QuotationTrash from './modules/QuotationManagement/QuotationTrash';

// placeholders
const ModulePlaceholder = ({ name }) => (
  <div className="luxury-card p-8 min-h-[500px] flex flex-col items-center justify-center mt-6">
    <h1 className="text-3xl font-bold text-blue-600">Admin Module: {name}</h1>
  </div>
);

const DestinationType = () => <ModulePlaceholder name="Destination Type Management" />;
const InvoiceManagement = () => <ModulePlaceholder name="Invoice Management Panel" />;
const BookingManagement = () => <ModulePlaceholder name="Booking Management Panel" />;
const PageBuilder = () => <ModulePlaceholder name="Page Builder Interface" />;
const SettingsPage = () => <ModulePlaceholder name="Settings" />;

import './css/AdminGlobal.css';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const adminApiKey = localStorage.getItem('admin_api_key');
  if (!adminApiKey) return <Navigate to="/admin/login" replace />;

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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={handleLogout} />
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={handleLogout} />
      <div className="dashboard-content" style={{ marginLeft: contentMargin }}>
        <div className="dashboard-inner-content">
          <Routes>
            <Route path="overview" element={<DashboardOverview />} />

            <Route path="trip-management/list" element={<TripList />} />
            <Route path="trip-management/create" element={<TripCreate />} />
            <Route path="trip-management/create/:id" element={<TripCreate />} />

            <Route path="add-destination" element={<DestinationList />} />
            <Route path="destination-create" element={<DestinationCreate />} />
            <Route path="destination-create/:id" element={<DestinationCreate />} />

            <Route path="add-categories" element={<CategoryList />} />
            <Route path="add-activity" element={<ActivityList />} />

            <Route path="lead-management" element={<LeadManagement />} />
            <Route path="lead-trash" element={<LeadTrash />} />

            {/* Quotations */}
            <Route path="quotations" element={<QuotationManagement />} />
            <Route path="quotations/trash" element={<QuotationTrash />} />

            <Route path="destination-type" element={<DestinationType />} />
            <Route path="invoice-management" element={<InvoiceManagement />} />
            <Route path="manage-bookings" element={<BookingManagement />} />
            <Route path="page-builder" element={<PageBuilder />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route index element={<DashboardOverview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
