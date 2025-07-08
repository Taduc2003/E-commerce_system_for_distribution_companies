import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <div className='text-3xl w-36 mb-5 font-bold text-gray-800'>TechStore</div>
                    {/* <img src={assets.logo} alt="" className='mb-5 w-32' /> */}
                    <p className='w-full md:w-2/3 test-gray-600'>
                        Tech Store - Cửa hàng công nghệ hàng đầu với các sản phẩm chất lượng cao và dịch vụ tốt nhất.
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>CÔNG TY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Trang Chủ</li>
                        <li>Giới Thiệu</li>
                        <li>Giao Hàng</li>
                        <li>Chính Sách Bảo Mật</li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+84 123 456 789</li>
                        <li>lienhe@techstore.com</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer
