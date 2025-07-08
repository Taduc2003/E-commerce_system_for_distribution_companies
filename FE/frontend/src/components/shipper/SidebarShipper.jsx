import React from 'react'
import { NavLink } from 'react-router-dom'


const SidebarShipper = () => {
  return (
        <div>
            <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-8">Shipper Panel</h2>
                <NavLink to="/shipper/order" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Đơn hàng</NavLink>
            </div>
        </div>
    )
}

export default SidebarShipper
