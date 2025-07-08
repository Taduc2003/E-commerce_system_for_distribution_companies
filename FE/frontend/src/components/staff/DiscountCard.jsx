import React from 'react';

const DiscountCard = ({ discount, onEdit, onDelete }) => {
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDiscountStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { text: 'Chưa bắt đầu', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        } else if (now > end) {
            return { text: 'Đã hết hạn', color: 'bg-red-100 text-red-800 border-red-200' };
        } else {
            return { text: 'Đang hoạt động', color: 'bg-green-100 text-green-800 border-green-200' };
        }
    };

    const status = getDiscountStatus(discount.startDate, discount.endDate);

    return (
        <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-start mb-4'>
                <div>
                    <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-bold text-gray-900'>#{discount.discountId}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                            {status.text}
                        </span>
                    </div>
                    <div className='bg-gray-100 px-3 py-2 rounded-md inline-block'>
                        <span className='text-xl font-mono font-bold text-blue-600'>{discount.code}</span>
                    </div>
                </div>
                <div className='text-right'>
                    <div className='text-3xl font-bold text-red-500 mb-1'>
                        {discount.discountPercentage}%
                    </div>
                    <div className='text-sm text-gray-500'>Giảm giá</div>
                </div>
            </div>

            <div className='space-y-2 mb-4'>
                <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium w-24'>Bắt đầu:</span>
                    <span>{formatDateTime(discount.startDate)}</span>
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium w-24'>Kết thúc:</span>
                    <span>{formatDateTime(discount.endDate)}</span>
                </div>
            </div>

            <div className='flex gap-2 pt-4 border-t border-gray-100'>
                <button
                    onClick={() => onEdit(discount)}
                    className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm'
                >
                    Chỉnh sửa
                </button>
                <button
                    onClick={() => onDelete(discount.discountId)}
                    className='flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors font-medium text-sm'
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

export default DiscountCard;