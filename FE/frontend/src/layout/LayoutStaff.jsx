import React from 'react'
import { Outlet } from 'react-router-dom';
import SidebarStaff from '../components/staff/SidebarStaff';
import NavbarStaff from '../components/staff/NavbarStaff';

const LayoutStaff = () => {
  return (
    <div className="flex min-h-screen">

      <SidebarStaff />

      <div className="flex-1 p-6 bg-gray-100">
        <NavbarStaff />
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutStaff
