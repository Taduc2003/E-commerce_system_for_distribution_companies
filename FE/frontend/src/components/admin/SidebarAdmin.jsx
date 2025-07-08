import React from 'react';
import { NavLink } from 'react-router-dom';


const SidebarAdmin = () => {
    return (
        <div>
            <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
                <h2 className="text-2xl font-bold mb-8">Menu</h2>
                <NavLink to="/admin/products" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Sản phẩm</NavLink>
                <NavLink to="/admin/employees" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Nhân viên</NavLink>
                <NavLink to="/admin/branches" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Chi nhánh</NavLink>
                <NavLink to="/admin/report" className="mb-4 hover:text-yellow-400" activeClassName="font-bold">Thống kê</NavLink>
            </div>
        </div>
    )
}

export default SidebarAdmin
