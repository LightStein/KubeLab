import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LaunchCluster from './pages/LaunchCluster';
import ClusterView from './pages/ClusterView';
import AdminDashboard from './pages/AdminDashboard';
import AdminClusters from './pages/AdminClusters';

function AppRoutes() {
  const { isAdmin } = useApp();

  return (
    <Routes>
      {/* Student Routes */}
      <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <Dashboard />} />
      <Route path="/launch" element={<LaunchCluster />} />
      <Route path="/cluster/:id" element={<ClusterView />} />

      {/* Admin Routes */}
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/clusters" element={isAdmin ? <AdminClusters /> : <Navigate to="/" />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
