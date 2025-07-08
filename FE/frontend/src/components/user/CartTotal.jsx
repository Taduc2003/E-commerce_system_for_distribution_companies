import React from 'react'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'
import Title from './Title'

const CartTotal = ({ total, deliveryMethod, selectedDiscount }) => {
    const { currency, formatPrice } = useContext(ShopContext)

    // Tính phí giao hàng dựa trên phương thức giao hàng
    const getDeliveryFee = () => {
        if (deliveryMethod === 'pickup') {
            return 0; // Nhận tại cửa hàng - miễn phí
        } else if (deliveryMethod === 'delivery') {
            return 25000; // Giao tận nơi - 25,000 VNĐ
        }
        return 25000; // Mặc định là giao hàng
    }

    // ✅ Tính discount amount - cập nhật theo cấu trúc mới
    const getDiscountAmount = () => {
        if (!selectedDiscount || !selectedDiscount.discountPercentage || total <= 0) return 0;

        // Chỉ có percentage discount
        const discountAmount = (total * selectedDiscount.discountPercentage) / 100;
        return Math.floor(discountAmount); // Làm tròn xuống
    };

    const deliveryFee = getDeliveryFee();
    const discountAmount = getDiscountAmount();
    const totalAfterDiscount = Math.max(0, total - discountAmount);
    const finalTotal = totalAfterDiscount + deliveryFee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'TỔNG'} text2={'GIỎ HÀNG'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Tạm Tính</p>
                    <p className='text-gray-500'>{formatPrice(total || 0)} {currency}</p>
                </div>

                {/* ✅ Hiển thị discount nếu có - cập nhật */}
                {selectedDiscount && discountAmount > 0 && (
                    <>
                        <hr />
                        <div className='flex justify-between'>
                            <p className='text-green-600'>
                                Giảm giá ({selectedDiscount.code})
                                <span className='text-xs ml-1'>(-{selectedDiscount.discountPercentage}%)</span>
                            </p>
                            <p className='text-green-600'>-{formatPrice(discountAmount)} {currency}</p>
                        </div>
                    </>
                )}

                <hr />
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Phí Giao Hàng</p>
                    <p className='text-gray-500'>
                        {deliveryMethod === 'pickup' ? `0 ${currency}` : `${formatPrice(deliveryFee)} ${currency}`}
                    </p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-medium text-gray-800'>Tổng Cộng</p>
                    <p className='font-medium text-gray-800'>{formatPrice(finalTotal)} {currency}</p>
                </div>

                {/* ✅ Hiển thị số tiền tiết kiệm */}
                {discountAmount > 0 && (
                    <div className='flex justify-between text-green-600 text-xs'>
                        <p>Bạn đã tiết kiệm:</p>
                        <p className='font-medium'>{formatPrice(discountAmount)} {currency}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartTotal
