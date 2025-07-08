import React from 'react';
import Title from './Title';

const OrderSummary = ({ selectedProducts, backendUrl, formatPrice, currency }) => {
    return (
        <div className='border rounded-lg p-6 bg-white shadow-sm'>
            <div className='text-xl sm:text-2xl mb-4'>
                <Title text1={'SẢN PHẨM'} text2={'ĐÃ CHỌN'} />
            </div>
            <div className='space-y-4'>
                {selectedProducts.map(item => (
                    <div key={item.cartDetailId} className='flex items-center gap-4 p-4 border rounded-lg bg-gray-50'>
                        <img
                            src={backendUrl + item.productImage}
                            alt=""
                            className='w-16 h-16 object-cover rounded'
                        />
                        <div className='flex-1'>
                            <h4 className='font-medium text-lg'>{item.productName}</h4>
                            <p className='text-gray-600 text-sm'>Số lượng: {item.quantity}</p>
                            <p className='text-gray-600 text-sm'>Đơn giá: {formatPrice(item.price)} {currency}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSummary;