import React from 'react';

const DeliveryMethod = ({ deliveryMethod, setDeliveryMethod }) => {
    return (
        <div className='mb-6'>
            <h3 className='text-lg font-medium mb-3'>Phương thức nhận hàng:</h3>
            <div className='flex gap-6'>
                <div className='flex gap-2 items-center'>
                    <input
                        type="radio"
                        name='deliveryMethod'
                        id='delivery'
                        checked={deliveryMethod === 'delivery'}
                        onChange={() => setDeliveryMethod('delivery')}
                        className='w-4 h-4'
                    />
                    <label htmlFor="delivery" className='text-sm'>Giao hàng tận nơi</label>
                </div>
                <div className='flex gap-2 items-center'>
                    <input
                        type="radio"
                        name='deliveryMethod'
                        id='pickup'
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className='w-4 h-4'
                    />
                    <label htmlFor="pickup" className='text-sm'>Nhận tại cửa hàng</label>
                </div>
            </div>
        </div>
    );
};

export default DeliveryMethod;