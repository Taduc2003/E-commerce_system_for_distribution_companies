import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'

const SidebarStaff = () => {
    const { staff } = useContext(UserContext);

    console.log("Staff", staff);

    const branchId = staff?.branch?.branchId;

    return (
        <div>
            <div className="w-40 h-full bg-gray-800 text-white flex flex-col p-4 items-center">
                <h2 className="text-2xl font-bold mb-8">Menu</h2>
                <NavLink to="/staff/products" className="mb-4 hover:text-blue-400" activeClassName="font-bold">Sản phẩm</NavLink>
                <NavLink to="/staff/discounts" className="mb-4 hover:text-blue-400" activeClassName="font-bold">Mã giảm giá</NavLink>
                <NavLink to="/staff/orders" className="mb-4 hover:text-blue-400" activeClassName="font-bold">Đơn hàng</NavLink>


                {branchId ? (
                    <NavLink to={`/staff/inventory/${branchId}`} className="mb-4 hover:text-blue-400" activeClassName="font-bold">
                        Kho hàng
                    </NavLink>
                ) : (
                    <span className="mb-4 text-gray-500 cursor-not-allowed">Kho hàng (Đang tải...)</span>
                )}
            </div>
        </div>
    );
}

export default SidebarStaff
