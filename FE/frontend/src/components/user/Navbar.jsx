import React, { useContext } from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import { UserContext } from '../../context/UserContext'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { setShowSearch, getCartCount, navigate  } = useContext(ShopContext);
    const { logout, token } = useContext(UserContext);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/'; // Reload toàn bộ trang
        
    };
    
    // console.log ('Token:', token);

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <div className='text-3xl w-36 font-bold text-gray-800'>TechStore</div>
            {/* /* <img src={assets.logo} alt="" className='w-36' /> */}
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>TRANG CHỦ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/filter' className='flex flex-col items-center gap-1'>
                    <p>SẢN PHẨM</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />

                <div className='group relative'>
                    <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>Hồ Sơ</p>
                            <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Đơn Hàng</p>
                            {token ? (
                                <p onClick={handleLogout} className='cursor-pointer hover:text-black'>Đăng Xuất</p>
                            ) : (
                                <Link to='/login' className='cursor-pointer hover:text-black'>Đăng Nhập</Link>
                            )}
                        </div>
                    </div>
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
            </div>

            {/* Sidebar for small screen */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180' ></img>
                        <p>Quay Lại</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py=2 pl-6 border' to='/'>TRANG CHỦ</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py=2 pl-6 border' to='/filter'>SẢN PHẨM</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar
