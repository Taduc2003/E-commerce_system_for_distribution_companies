import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';

const BranchItem = ({ branch, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInventoryClick = () => {
        navigate(`/admin/inventory/${branch.branchId}`);
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`Bạn có chắc muốn xóa chi nhánh "${branch.address}"?`)) {
            setIsDeleting(true);
            await onDelete(branch.branchId);
            setIsDeleting(false);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow'>
            {/* Branch Header */}
            <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                        Chi nhánh #{branch.branchId}
                    </h3>
                    <div className='space-y-2'>
                        <div className='text-gray-600'>
                            <p className="font-semibold">Địa chỉ: <span className='text-sm'>{branch.address}</span></p>
                        </div>
                        <div className='text-gray-600'>
                            <p className="font-semibold">Số điện thoại: <span className='text-sm'>{branch.phone}</span></p>
                            
                        </div>
                    </div>
                </div>

                {/* Branch Status Badge */}
                <span className='px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full'>
                    Hoạt động
                </span>
            </div>

            {/* Statistics */}
            {branch.inventories && (
                <div className='grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg'>
                    <div className='text-center'>
                        <p className='text-2xl font-bold text-gray-800'>{branch.inventories.length}</p>
                        <p className='text-xs text-gray-500'>Sản phẩm</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-2xl font-bold text-gray-800'>
                            {branch.inventories.filter(item => item.quantity > 0).length}
                        </p>
                        <p className='text-xs text-gray-500'>Còn hàng</p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={handleInventoryClick}
                    className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors'
                >
                    Kho hàng
                </button>

                <button
                    onClick={() => onEdit(branch)}
                    className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors'
                >
                    Sửa
                </button>

                <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className={`px-4 py-2 text-white text-sm font-medium rounded transition-colors ${isDeleting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                        }`}
                >
                    {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
            </div>
        </div>
    );
};

export default BranchItem;