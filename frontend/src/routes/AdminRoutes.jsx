import React from 'react';
import { Route, Routes ,Navigate } from 'react-router-dom'

import AdminLayout from '../components/layout/admin/AdminLayout';
import UserManagement from '../pages/admin/UserManagement';
import LiveAuctions from '../pages/admin/LiveAuctions';


const AdminRoutes = () => {
  return (
    <Routes>

      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="live-auctions" element={<LiveAuctions />} />
        <Route path="users" element={<UserManagement />} />
        {/* <Route path="collections" element={<Collections />} /> */}
        {/* <Route path="bidders" element={<Bidders />} /> */}
        {/* <Route path="analytics" element={<Analytics />} /> */}
        {/* <Route path="settings" element={<Settings />} /> */}
        
      </Route>
    </Routes>
  )
}

export default AdminRoutes;
