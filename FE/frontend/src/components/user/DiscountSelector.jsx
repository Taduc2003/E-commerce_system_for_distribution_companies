import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

const DiscountSelector = ({ selectedDiscount, onDiscountChange, orderTotal }) => {
    const { fetchAllActiveDiscounts } = useContext(ShopContext);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDiscounts, setShowDiscounts] = useState(false);

    // Fetch discounts khi component mount
    useEffect(() => {
        const loadDiscounts = async () => {
            setLoading(true);
            try {
                const activeDiscounts = await fetchAllActiveDiscounts();
                console.log('Active discounts:', activeDiscounts);
                setDiscounts(activeDiscounts || []);
            } catch (error) {
                console.error('Error loading discounts:', error);
                setDiscounts([]);
            } finally {
                setLoading(false);
            }
        };

        if (orderTotal > 0) {
            loadDiscounts();
        }
    }, [fetchAllActiveDiscounts, orderTotal]);

    // ✅ Format discount text - cập nhật theo cấu trúc mới
    const formatDiscountText = (discount) => {
        return `Giảm ${discount.discountPercentage}%`;
    };

    // ✅ Tính số tiền được giảm - cập nhật theo cấu trúc mới
    const calculateDiscountAmount = (discount) => {
        if (!discount || !discount.discountPercentage) return 0;

        // Chỉ có percentage discount
        const amount = (orderTotal * discount.discountPercentage) / 100;
        return Math.floor(amount); // Làm tròn xuống
    };

    const handleDiscountSelect = (discount) => {
        onDiscountChange(discount);
        setShowDiscounts(false);
    };

    const handleRemoveDiscount = () => {
        onDiscountChange(null);
    };

    // ✅ Check discount có còn hiệu lực không
    const isDiscountValid = (discount) => {
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = new Date(discount.endDate);
        return now >= startDate && now <= endDate;
    };

    // ✅ Format date để hiển thị
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className='border rounded-lg p-4 bg-gray-50'>
                <div className='animate-pulse'>
                    <div className='h-4 bg-gray-300 rounded w-1/3 mb-2'></div>
                    <div className='h-8 bg-gray-300 rounded'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='border rounded-lg p-4 bg-gray-50'>
            <h3 className='font-medium text-gray-800 mb-3'>Mã giảm giá</h3>

            {/* Selected discount display */}
            {selectedDiscount ? (
                <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-3'>
                    <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                            <div className='font-medium text-green-800'>{selectedDiscount.code}</div>
                            <div className='text-sm text-green-600'>{formatDiscountText(selectedDiscount)}</div>
                            <div className='text-sm text-green-700 font-medium mt-1'>
                                Tiết kiệm: {calculateDiscountAmount(selectedDiscount).toLocaleString('vi-VN')} VNĐ
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveDiscount}
                            className='text-red-500 hover:text-red-700 text-sm ml-2'
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                /* No discount selected */
                <div className='text-center py-2 text-gray-500 text-sm'>
                    Chưa áp dụng mã giảm giá
                </div>
            )}

            {/* Discount selection */}
            {discounts.length > 0 ? (
                <div>
                    <button
                        onClick={() => setShowDiscounts(!showDiscounts)}
                        className='w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                    >
                        {showDiscounts ? 'Ẩn mã giảm giá' : `Chọn mã giảm giá (${discounts.length} khả dụng)`}
                    </button>

                    {showDiscounts && (
                        <div className='mt-3 space-y-2 max-h-60 overflow-y-auto'>
                            {discounts.map((discount) => {
                                const isValid = isDiscountValid(discount);
                                return (
                                    <div
                                        key={discount.discountId}
                                        onClick={() => isValid && handleDiscountSelect(discount)}
                                        className={`p-3 border rounded-lg transition-colors ${!isValid
                                                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                                                : selectedDiscount?.discountId === discount.discountId
                                                    ? 'border-green-500 bg-green-50 cursor-pointer'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                                            }`}
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div className='flex-1'>
                                                <div className={`font-medium ${isValid ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {discount.code}
                                                    {!isValid && <span className='ml-2 text-red-500 text-xs'>(Hết hạn)</span>}
                                                </div>
                                                <div className={`text-sm ${isValid ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    {formatDiscountText(discount)}
                                                </div>
                                                <div className={`text-xs mt-1 ${isValid ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Có hiệu lực: {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                                                </div>
                                            </div>
                                            {isValid && (
                                                <div className='text-right ml-2'>
                                                    <div className='text-sm font-medium text-green-600'>
                                                        -{calculateDiscountAmount(discount).toLocaleString('vi-VN')} VNĐ
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className='text-center py-2 text-gray-400 text-sm'>
                    Không có mã giảm giá khả dụng
                </div>
            )}
        </div>
    );
};

export default DiscountSelector;