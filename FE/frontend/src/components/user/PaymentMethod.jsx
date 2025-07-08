import React from 'react';

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <div className='mt-6 pt-6 border-t'>
            <div className='text-lg font-medium mb-4'>
                Phương thức thanh toán:
            </div>
            <div className='space-y-3 mb-6'>
                <div className='flex gap-3 items-center p-3 border rounded hover:bg-gray-50'>
                    <input
                        type="radio"
                        name='payment'
                        id='cod'
                        value='cod'
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className='w-4 h-4'
                    />
                    <label htmlFor="cod" className='flex-1 cursor-pointer'>
                        <div className='font-medium'>Thanh toán khi nhận hàng (COD)</div>
                        <div className='text-gray-600 text-sm'>Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </label>
                </div>
                <div className='flex gap-3 items-center p-3 border rounded hover:bg-gray-50'>
                    <input
                        type="radio"
                        name='payment'
                        id='card'
                        value='card'
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className='w-4 h-4'
                    />
                    <label htmlFor="card" className='flex-1 cursor-pointer'>
                        <div className='font-medium'>Thẻ tín dụng/Ghi nợ</div>
                        <div className='text-gray-600 text-sm'>Thanh toán online qua cổng thanh toán</div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;