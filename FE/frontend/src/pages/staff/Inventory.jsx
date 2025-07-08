import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProductContext } from '../../context/ProductContext';
import Title from '../../components/user/Title';

const Inventory = () => {
  const { branchId } = useParams();
  const { fetchBranchById, updateInventoryQuantity } = useContext(ProductContext);

  // ✅ State để quản lý dữ liệu
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ State cho edit functionality
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [updating, setUpdating] = useState(false);

  // ✅ useEffect để fetch data
  useEffect(() => {
    const loadBranchData = async () => {
      try {
        setLoading(true);
        const branchData = await fetchBranchById(branchId);
        if (branchData) {
          setBranch(branchData);
        } else {
          setError('Không tìm thấy thông tin chi nhánh');
        }
      } catch (err) {
        console.error('Error loading branch:', err);
        setError('Lỗi khi tải thông tin chi nhánh');
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      loadBranchData();
    }
  }, [branchId, fetchBranchById]);

  // ✅ Handle edit actions
  const handleEditStart = (item) => {
    setEditingItem(item.inventoryId);
    setEditQuantity(item.quantity.toString());
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditQuantity('');
  };

  const handleEditSave = async (inventoryId) => {
    if (!editQuantity || editQuantity < 0) {
      alert('Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    setUpdating(true);
    try {
      const updatedInventory = await updateInventoryQuantity(inventoryId, parseInt(editQuantity));

      if (updatedInventory) {
        // ✅ Cập nhật state local
        setBranch(prev => ({
          ...prev,
          inventories: prev.inventories.map(item =>
            item.inventoryId === inventoryId
              ? { ...item, quantity: parseInt(editQuantity), lastUpdated: new Date().toISOString() }
              : item
          )
        }));

        setEditingItem(null);
        setEditQuantity('');
        alert('Cập nhật số lượng thành công!');
      } else {
        alert('Cập nhật thất bại! Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Lỗi khi cập nhật! Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Hết hàng', color: 'bg-red-500', textColor: 'text-red-700' };
    if (quantity < 10) return { text: 'Sắp hết', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (quantity < 50) return { text: 'Ít hàng', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { text: 'Còn hàng', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // ✅ Loading state
  if (loading) {
    return (
      <div className='p-6'>
        <div className='text-2xl mb-8'>
          <Title text1={'KHO HÀNG'} text2={'CHI NHÁNH'} />
        </div>
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='text-gray-500 ml-4'>Đang tải thông tin kho hàng...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className='p-6'>
        <div className='text-2xl mb-8'>
          <Title text1={'KHO HÀNG'} text2={'CHI NHÁNH'} />
        </div>
        <div className='text-center py-8'>
          <p className='text-red-500'>{error}</p>
        </div>
      </div>
    );
  }

  // ✅ No data state
  if (!branch) {
    return (
      <div className='p-6'>
        <div className='text-2xl mb-8'>
          <Title text1={'KHO HÀNG'} text2={'CHI NHÁNH'} />
        </div>
        <div className='text-center py-8'>
          <p className='text-gray-500'>Không có dữ liệu chi nhánh</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='text-2xl mb-8'>
        <Title text1={'KHO HÀNG'} text2={'CHI NHÁNH'} />
      </div>

      {/* ✅ Branch Info Header */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Thông tin chi nhánh</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <span className='text-sm font-medium text-gray-500'>ID Chi nhánh:</span>
            <p className='text-lg text-gray-800'>#{branch.branchId}</p>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-500'>Địa chỉ:</span>
            <p className='text-lg text-gray-800'>{branch.address}</p>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-500'>Số điện thoại:</span>
            <p className='text-lg text-gray-800'>{branch.phone}</p>
          </div>
        </div>
      </div>

      {/* ✅ Inventory Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
          <h3 className='text-sm font-medium text-blue-800'>Tổng sản phẩm</h3>
          <p className='text-2xl font-bold text-blue-900'>{branch.inventories?.length || 0}</p>
        </div>
        <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
          <h3 className='text-sm font-medium text-green-800'>Còn hàng</h3>
          <p className='text-2xl font-bold text-green-900'>
            {branch.inventories?.filter(item => item.quantity > 0).length || 0}
          </p>
        </div>
        <div className='bg-red-50 rounded-lg p-4 border border-red-200'>
          <h3 className='text-sm font-medium text-red-800'>Hết hàng</h3>
          <p className='text-2xl font-bold text-red-900'>
            {branch.inventories?.filter(item => item.quantity === 0).length || 0}
          </p>
        </div>
        <div className='bg-yellow-50 rounded-lg p-4 border border-yellow-200'>
          <h3 className='text-sm font-medium text-yellow-800'>Tổng giá trị</h3>
          <p className='text-2xl font-bold text-yellow-900'>
            {formatPrice(
              branch.inventories?.reduce((total, item) =>
                total + (item.product.price * item.quantity), 0
              ) || 0
            )} đ
          </p>
        </div>
      </div>

      {/* ✅ Inventory Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-800'>Danh sách tồn kho</h3>
        </div>

        {branch.inventories && branch.inventories.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Sản phẩm
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Danh mục
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Giá
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Số lượng
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Đã bán
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cập nhật
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {branch.inventories.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  const isEditing = editingItem === item.inventoryId;

                  return (
                    <tr key={item.inventoryId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <img
                            src={item.product.image ? `${backendUrl}${item.product.image}` : '/placeholder.jpg'}
                            alt={item.product.productName}
                            className='w-12 h-12 rounded-lg object-cover'
                          />
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {item.product.productName}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {item.product.supplier}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                          {item.product.category.categoryName}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatPrice(item.product.price)} đ
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {/* ✅ Editable quantity field */}
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className='w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                            disabled={updating}
                          />
                        ) : (
                          <span className={`text-sm font-medium ${stockStatus.textColor}`}>
                            {item.quantity}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {item.product.quantitySold || 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(item.lastUpdated)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        {/* ✅ Edit action buttons */}
                        {isEditing ? (
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleEditSave(item.inventoryId)}
                              disabled={updating}
                              className={`px-3 py-1 text-xs rounded transition-colors ${updating
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                              {updating ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                              onClick={handleEditCancel}
                              disabled={updating}
                              className='px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors'
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditStart(item)}
                            className='px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors'
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>Không có sản phẩm nào trong kho</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
