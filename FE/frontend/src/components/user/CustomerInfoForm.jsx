import React from 'react';

const CustomerInfoForm = ({ formData, handleInputChange }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <input
                type="text"
                name="fullName"
                placeholder='Họ và tên *'
                value={formData.fullName}
                onChange={handleInputChange}
                className='border border-gray-300 w-full py-3 rounded px-4'
                required
                readOnly
            />
            <input
                type="email"
                name="email"
                placeholder='Email *'
                value={formData.email}
                onChange={handleInputChange}
                className='border border-gray-300 w-full py-3 rounded px-4'
                required
                readOnly
            />
            <input
                type="tel"
                name="phone"
                placeholder='Số điện thoại *'
                value={formData.phone}
                onChange={handleInputChange}
                className='border border-gray-300 w-full py-3 rounded px-4'
                required
                readOnly
            />
            <input
                type="text"
                name="note"
                placeholder='Ghi chú (tùy chọn)'
                value={formData.note}
                onChange={handleInputChange}
                className='border border-gray-300 w-full py-3 rounded px-4'
            />
        </div>
    );
};

export default CustomerInfoForm;