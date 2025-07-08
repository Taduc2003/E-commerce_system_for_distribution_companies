import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import NavbarAdmin from '../components/admin/NavbarAdmin';


const LayoutAdmin = () => (
  <div className="flex min-h-screen">

    <SidebarAdmin />

    <main className="flex-1 p-6 bg-gray-100">
      <NavbarAdmin />
      <Outlet />
    </main>
  </div>
);

export default LayoutAdmin;