import React from 'react'
import { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { UserContext } from '../../context/UserContext';
import { assets } from '../../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom';


const NavbarStaff = () => {
    const [visible, setVisible] = useState(false)
    // const { setShowSearch } = useContext(ShopContext);
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    const goToProfile = () => {
        navigate('/staff/profile');
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

        </div>
    )
}

export default NavbarStaff
