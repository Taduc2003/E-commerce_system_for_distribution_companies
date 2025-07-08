import React from 'react'
import SidebarShipper from '../components/shipper/SidebarShipper'
import NavbarStaff from '../components/staff/NavbarStaff'
import { Outlet } from 'react-router-dom'

const LayoutShipper = () => {
  return (
    <div className="flex min-h-screen">

      <SidebarShipper />

      <div className="flex-1 p-6 bg-gray-100">
        <NavbarStaff />
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutShipper
