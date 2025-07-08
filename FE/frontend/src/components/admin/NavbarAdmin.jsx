import React, { useContext } from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const NavbarAdmin = () => {
    const [visible, setVisible] = useState(false)
    // ✅ Loại bỏ setShowSearch vì admin không cần search
    // const { setShowSearch } = useContext(ShopContext);
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    const goToProfile = () => {
        navigate('/admin/profile');
    };

    return (
        <div className='flex pb-5 border-b-2 items-center justify-between font-medium'>
            {/* ✅ Thêm title cho admin */}
            <div className='text-2xl font-bold text-gray-800'>
                TechStore
            </div>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            </ul>

            <div className='flex items-center gap-6'>
                {/* ✅ Loại bỏ search icon vì admin không cần search */}
                {/* <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' /> */}

                <div className='group relative'>
                    <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
                            <p onClick={goToProfile} className='cursor-pointer hover:text-black'>Hồ Sơ</p>
                            <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Đăng Xuất</p>
                        </div>
                    </div>
                </div>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
            </div>

            {/* Mobile menu */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-40 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180' />
                        <p>Quay Lại</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/admin/products'>SẢN PHẨM</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/admin/employees'>NHÂN VIÊN</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/admin/report'>BÁO CÁO</NavLink>
                    <p onClick={() => { goToProfile(); setVisible(false); }} className='py-2 pl-6 border cursor-pointer'>HỒ SƠ</p>
                    <p onClick={() => { handleLogout(); setVisible(false); }} className='py-2 pl-6 border cursor-pointer'>ĐĂNG XUẤT</p>
                </div>
            </div>
        </div>




   )
}

export default NavbarAdmin
