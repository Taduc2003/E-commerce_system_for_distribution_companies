import React from 'react'
import { NavLink } from 'react-router-dom'



const SidebarStaff = () => {
  return (
        <div>
            <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-8">Staff Panel</h2>
                <NavLink to="/staff/products" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Sản phẩm</NavLink>
                <NavLink to="/staff/discounts" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Mã giảm giá</NavLink>
                <NavLink to="/staff/orders" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Đơn hàng</NavLink>
                <NavLink to="/staff/inventory" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Kho hàng</NavLink>
            </div>
        </div>
    )
}

export default SidebarStaff
