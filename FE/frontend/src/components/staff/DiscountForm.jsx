import React, { useState, useEffect } from 'react';

const DiscountForm = ({ discount, onSave, onCancel, isEdit = false }) => {
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        startDate: '',
        endDate: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (discount) {
            setFormData({
                code: discount.code || '',
                discountPercentage: discount.discountPercentage || '',
                startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
                endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : ''
            });
        }
    }, [discount]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Mã giảm giá không được để trống';
        } else if (formData.code.length < 3) {
            newErrors.code = 'Mã giảm giá phải có ít nhất 3 ký tự';
        }

        if (!formData.discountPercentage) {
            newErrors.discountPercentage = 'Phần trăm giảm giá không được để trống';
        } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
            newErrors.discountPercentage = 'Phần trăm giảm giá phải từ 1 đến 100';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Ngày bắt đầu không được để trống';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Ngày kết thúc không được để trống';
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) >= new Date(formData.endDate)) {
                newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                discountPercentage: parseFloat(formData.discountPercentage),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            };

            if (isEdit) {
                submitData.discountId = discount.discountId;
            }

            onSave(submitData);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
                <h3 className='text-xl font-bold mb-6 text-gray-800'>
                    {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
                </h3>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>
                            Mã giảm giá <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.code ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="VD: SALE20, NEWUSER..."
                        />
                        {errors.code && <p className='text-red-500 text-xs mt-1'>{errors.code}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>
                            Phần trăm giảm giá (%) <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="number"
                            name="discountPercentage"
                            value={formData.discountPercentage}
                            onChange={handleInputChange}
                            min="1"
                            max="100"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.discountPercentage ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="VD: 10, 20, 50..."
                        />
                        {errors.discountPercentage && <p className='text-red-500 text-xs mt-1'>{errors.discountPercentage}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>
                            Ngày bắt đầu <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.startDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.startDate && <p className='text-red-500 text-xs mt-1'>{errors.startDate}</p>}
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-700'>
                            Ngày kết thúc <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.endDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.endDate && <p className='text-red-500 text-xs mt-1'>{errors.endDate}</p>}
                    </div>

                    <div className='flex gap-3 pt-6'>
                        <button
                            type="submit"
                            className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium'
                        >
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className='flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium'
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountForm;