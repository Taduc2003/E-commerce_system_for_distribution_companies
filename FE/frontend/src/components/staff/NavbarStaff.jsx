import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { UserContext } from '../../context/UserContext';
import { assets } from '../../assets/assets'


const NavbarStaff = () => {
    // const [visible, setVisible] = useState(false)
    const { setShowSearch } = useContext(ShopContext);
    const { logout } = useContext(UserContext);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <div className='flex pb-5 border-b-2 items-center justify-between py-5 font-medium'>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />

                <div className='group relative'>
                    <img src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p className='cursor-pointer hover:text-black'>Hồ Sơ</p>
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
