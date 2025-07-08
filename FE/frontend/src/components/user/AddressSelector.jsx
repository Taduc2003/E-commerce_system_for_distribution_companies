import React from 'react';

const AddressSelector = ({
    deliveryMethod,
    formData,
    handleInputChange,
    branches,
    selectedProducts, // ✅ Thêm prop này
    selectedBranch,
    setSelectedBranch
}) => {
    if (deliveryMethod === 'delivery') {
        return (
            <div className='space-y-4'>
                <h4 className='text-md font-medium'>Địa chỉ giao hàng:</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input
                        type="text"
                        name="city"
                        placeholder='Tỉnh/Thành phố *'
                        value={formData.city}
                        onChange={handleInputChange}
                        className='border border-gray-300 w-full py-3 rounded px-4'
                        required
                    />
                    <input
                        type="text"
                        name="district"
                        placeholder='Quận/Huyện *'
                        value={formData.district}
                        onChange={handleInputChange}
                        className='border border-gray-300 w-full py-3 rounded px-4'
                        required
                    />
                </div>
                <input
                    type="text"
                    name="address"
                    placeholder='Địa chỉ chi tiết (số nhà, tên đường) *'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='border border-gray-300 w-full py-3 rounded px-4'
                    required
                />
            </div>
        );
    }

    // ✅ Hàm check branch có đủ hàng không - ĐƠN GIẢN
    const checkBranchAvailable = (branch) => {
        if (!selectedProducts || selectedProducts.length === 0) return true;

        return selectedProducts.every(selectedProduct => {
            const inventory = branch.inventories?.find(inv =>
                inv.product.productId === selectedProduct.productId
            );
            return inventory && inventory.quantity >= selectedProduct.quantity;
        });
    };

    // ✅ Lọc branches có đủ hàng
    const availableBranches = branches.filter(checkBranchAvailable);

    // ✅ Nếu không có branch nào đủ hàng
    if (availableBranches.length === 0) {
        return (
            <div className='space-y-4'>
                <h4 className='text-md font-medium'>Chọn chi nhánh nhận hàng:</h4>
                <div className='bg-red-50 border border-red-200 p-4 rounded text-center'>
                    <span className='text-red-600'>⚠️ Không có chi nhánh nào có đủ hàng cho đơn hàng này</span>
                    <p className='text-sm text-red-500 mt-1'>Vui lòng chọn "Giao tận nơi"</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <h4 className='text-md font-medium'>Chọn chi nhánh nhận hàng:</h4>

            {/* Thông báo số lượng branches khả dụng */}
            {/* <div className='bg-green-50 border border-green-200 p-2 rounded text-center'>
                <span className='text-green-700 text-sm'>
                    ✅ {availableBranches.length} chi nhánh có đủ hàng
                </span>
            </div> */}

            <div className='space-y-3'>
                {availableBranches.map(branch => (
                    <div key={branch.branchId} className='border border-gray-300 rounded p-4 hover:bg-gray-50'>
                        <div className='flex gap-3 items-start'>
                            <input
                                type="radio"
                                name='branch'
                                id={`branch-${branch.branchId}`}
                                value={branch.branchId}
                                checked={selectedBranch === branch.branchId.toString()}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className='w-4 h-4 mt-1'
                            />
                            <label htmlFor={`branch-${branch.branchId}`} className='flex-1 cursor-pointer'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <div className='font-medium text-gray-800'>{branch.address}</div>
                                    <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded'>Có đủ hàng</span>
                                </div>
                                {/* <div className='text-gray-600 text-sm'>📍 {branch.address}</div> */}
                                <div className='text-gray-600 text-sm'>SĐT: {branch.phone}</div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressSelector;