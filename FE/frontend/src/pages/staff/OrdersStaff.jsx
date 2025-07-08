import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import Title from '../../components/user/Title';
import axios from '../../api/axiosInstance';

const OrdersStaff = () => {
  const { currency, formatPrice, fetchOrderDetails, fetchBranchOrdersByStaff, updateOrderStatus } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [orderUserList, setOrderUserList] = useState([]);
  // ✅ Thêm state cho status update
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const data = await fetchBranchOrdersByStaff();
      console.log('Fetched orders:', data);
      setOrderUserList(data);
      setLoading(false);
    };
    getProducts();
  }, [fetchBranchOrdersByStaff]);

  // ✅ Hàm update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      console.log('Updating status for order:', orderId, 'to', newStatus);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        // Cập nhật state local
        setOrderUserList(prev =>
          prev.map(order =>
            order.orderId === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );
        
        // Reset selected status
        setSelectedStatus(prev => ({ ...prev, [orderId]: '' }));
      }
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // ✅ Hàm xử lý thay đổi status trong dropdown
  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  // ✅ Danh sách các trạng thái có thể chọn
  const statusOptions = [
    { value: 'Pending', label: 'Chờ xử lý', color: 'bg-yellow-500' },
    { value: 'Processing', label: 'Đang xử lý', color: 'bg-blue-500' },
    { value: 'Shipped', label: 'Đang giao', color: 'bg-purple-500' },
    { value: 'Completed', label: 'Hoàn thành', color: 'bg-green-500' },
    { value: 'Cancelled', label: 'Đã hủy', color: 'bg-red-500' }
  ];

  // Hàm lấy chi tiết order
  const handleFetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: prev[orderId].show ? { ...prev[orderId], show: false } : { ...prev[orderId], show: true }
      }));
      return;
    }

    try {
      setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
      const details = await fetchOrderDetails(orderId);
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: { data: details, show: true }
      }));
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status color và text
  const getStatusInfo = (status) => {
    const statusOption = statusOptions.find(option =>
      option.value.toLowerCase() === status?.toLowerCase()
    );

    if (statusOption) {
      return { color: statusOption.color, text: statusOption.label };
    }

    return { color: 'bg-gray-500', text: 'Không xác định' };
  };

  // Format payment method
  const getPaymentMethodText = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return 'Tiền mặt';
      case 'credit_card':
        return 'Thẻ tín dụng';
      case 'bank_transfer':
        return 'Chuyển khoản';
      case 'e_wallet':
        return 'Ví điện tử';
      default:
        return method || 'N/A';
    }
  };

  // Format delivery method
  const getDeliveryMethodText = (method) => {
    switch (method?.toLowerCase()) {
      case 'delivery':
        return 'Giao tận nơi';
      case 'pickup':
        return 'Nhận tại cửa hàng';
      default:
        return method || 'N/A';
    }
  };

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  if (loading) {
    return (
      <div className='p-6'>
        <div className='text-2xl mb-8'>
          <Title text1={'ĐƠN HÀNG'} text2={'CHI NHÁNH'} />
        </div>
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-500'>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='text-2xl mb-8'>
        <Title text1={'ĐƠN HÀNG'} text2={'CHI NHÁNH'} />
      </div>

      {orderUserList.length === 0 ? (
        <div className='flex justify-center items-center py-8'>
          <p className='text-gray-500'>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {orderUserList.map((order) => (
            <div key={order.orderId} className='border rounded-lg p-6 bg-white shadow-sm'>
              {/* Order Header */}
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 pb-4 border-b'>
                <div className='flex-1'>
                  <h3 className='text-lg font-medium text-gray-800'>
                    Đơn hàng #{order.orderId}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    Ngày đặt: {formatDate(order.orderDate)}
                  </p>
                </div>

                {/* ✅ Status và Status Update Controls */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 lg:mt-0'>
                  {/* Current Status */}
                  <div className='flex items-center gap-2'>
                    <span className={`w-3 h-3 rounded-full ${getStatusInfo(order.status).color}`}></span>
                    <span className='text-sm font-medium'>{getStatusInfo(order.status).text}</span>
                  </div>

                  {/* Status Update Controls */}
                  <div className='flex items-center gap-2'>
                    <select
                      value={selectedStatus[order.orderId] || ''}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className='text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500'
                      disabled={updatingStatus[order.orderId]}
                    >
                      <option value="">Chọn trạng thái mới</option>
                      {statusOptions
                        .filter(option => option.value.toLowerCase() !== order.status?.toLowerCase())
                        .map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      }
                    </select>

                    <button
                      onClick={() => handleUpdateStatus(order.orderId, selectedStatus[order.orderId])}
                      disabled={!selectedStatus[order.orderId] || updatingStatus[order.orderId]}
                      className={`px-3 py-1 text-sm rounded transition-colors ${!selectedStatus[order.orderId] || updatingStatus[order.orderId]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                      {updatingStatus[order.orderId] ? (
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 border border-white border-t-transparent rounded-full animate-spin'></div>
                          <span>Đang cập nhật...</span>
                        </div>
                      ) : (
                        'Cập nhật'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Phương thức nhận:</span> {getDeliveryMethodText(order.getOrderMethod)}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    <span className='font-medium'>Thanh toán:</span> {getPaymentMethodText(order.paymentMethod)}
                  </p>
                  {order.shippingAddress && (
                    <p className='text-sm text-gray-600 mt-1'>
                      <span className='font-medium'>Địa chỉ:</span> {order.shippingAddress}
                    </p>
                  )}
                </div>
                <div className='text-right'>
                  <p className='text-lg font-semibold text-red-600'>
                    Tổng tiền: {formatPrice(order.totalAmount)} {currency}
                  </p>
                  <button
                    onClick={() => handleFetchOrderDetails(order.orderId)}
                    disabled={loadingDetails[order.orderId]}
                    className={`mt-2 px-4 py-2 text-white text-sm rounded transition-colors ${loadingDetails[order.orderId]
                      ? 'bg-gray-400 cursor-not-allowed'
                      : orderDetails[order.orderId]?.show
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    {loadingDetails[order.orderId]
                      ? 'Đang tải...'
                      : orderDetails[order.orderId]?.show
                        ? 'Ẩn chi tiết'
                        : 'Xem chi tiết'
                    }
                  </button>
                </div>
              </div>

              {/* Order Items - Chỉ hiển thị khi đã fetch và show = true */}
              {orderDetails[order.orderId]?.show && orderDetails[order.orderId]?.data && (
                <div className='border-t pt-4'>
                  <h4 className='font-medium text-gray-800 mb-3'>Chi tiết sản phẩm:</h4>
                  <div className='space-y-3'>
                    {orderDetails[order.orderId].data.map((detail, index) => (
                      <div key={index} className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg'>
                        <img
                          src={detail.product?.image ? `${backendUrl}${detail.product.image}` : '/placeholder.jpg'}
                          alt={detail.product?.productName || 'Product'}
                          className='w-16 h-16 object-cover rounded'
                        />
                        <div className='flex-1'>
                          <h5 className='font-medium text-gray-800'>
                            {detail.product?.productName || 'Sản phẩm'}
                          </h5>
                          <div className='flex items-center gap-4 mt-1 text-sm text-gray-600'>
                            <span>Số lượng: {detail.quantity}</span>
                            <span>Đơn giá: {formatPrice(detail.price)} {currency}</span>
                            <span className='font-medium'>
                              Thành tiền: {formatPrice(detail.price * detail.quantity)} {currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersStaff
