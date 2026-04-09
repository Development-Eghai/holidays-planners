import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PrivateRoute from "./admin/PrivateRoute";
import LandingPageRenderer from "./landing/templates/Landingpagerenderer";

export default function App() {
  return (
    <Routes>

      <Route path="/landing/:slug" element={<LandingPageRenderer />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      <Route element={<PrivateRoute />}>
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}
