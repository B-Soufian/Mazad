import React from 'react';
import { Route, Routes ,Navigate } from 'react-router-dom'

import AdminLayout from '../components/layout/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Approvals from '../pages/admin/Approvals';
import LiveAuctions from '../pages/admin/LiveAuctions';
import Categories from '../pages/admin/Categories';
import UserManagement from '../pages/admin/UserManagement';
import Ledger from '../pages/admin/Ledger';
import AdminTickets from '../pages/admin/Tickets';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="live-auctions" element={<LiveAuctions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="ledger" element={<Ledger />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes;
