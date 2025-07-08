import React, { useContext, useEffect, useState } from 'react'
import Title from '../../components/user/Title';
import { ShopContext } from '../../context/ShopContext';

const Orders = () => {
  const {
    orderUserList, currency, formatPrice, fetchOrderDetails,
    cancelOrder // ✅ Thêm cancelOrder
  } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({}); // Lưu chi tiết các order
  const [loadingDetails, setLoadingDetails] = useState({}); // Loading state cho từng order
  const [cancellingOrders, setCancellingOrders] = useState({}); // ✅ Loading state cho việc hủy đơn hàng

  // ✅ Thêm state cho filter
  const [selectedStatus, setSelectedStatus] = useState('all');

  // ✅ Danh sách các trạng thái để filter
  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: orderUserList.length },
    { value: 'pending', label: 'Chờ xử lý', count: orderUserList.filter(o => o.status?.toLowerCase() === 'pending').length },
    { value: 'processing', label: 'Đang xử lý', count: orderUserList.filter(o => o.status?.toLowerCase() === 'processing').length },
    { value: 'shipped', label: 'Đang giao', count: orderUserList.filter(o => o.status?.toLowerCase() === 'shipped').length },
    { value: 'completed', label: 'Hoàn thành', count: orderUserList.filter(o => o.status?.toLowerCase() === 'completed').length },
    { value: 'cancelled', label: 'Đã hủy', count: orderUserList.filter(o => o.status?.toLowerCase() === 'cancelled').length }
  ];

  // ✅ Lọc orders theo trạng thái đã chọn
  const filteredOrders = selectedStatus === 'all'
    ? orderUserList
    : orderUserList.filter(order => order.status?.toLowerCase() === selectedStatus);

  // Hàm lấy chi tiết order
  const handleFetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      // Nếu đã có chi tiết, ẩn/hiện chi tiết
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

  // ✅ Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancellingOrders(prev => ({ ...prev, [orderId]: true }));
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setCancellingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // ✅ Kiểm tra đơn hàng có thể hủy được không
  const canCancelOrder = (status) => {
    const cancelableStatuses = ['pending']
    return cancelableStatuses.includes(status?.toLowerCase());
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-500', text: 'Chờ xử lý' };
      case 'processing':
        return { color: 'bg-blue-500', text: 'Đang xử lý' };
      case 'shipped':
        return { color: 'bg-purple-500', text: 'Đang giao' };
      case 'completed':
        return { color: 'bg-green-500', text: 'Hoàn thành' };
      case 'cancelled':
        return { color: 'bg-red-500', text: 'Đã hủy' };
      default:
        return { color: 'bg-gray-500', text: 'Không xác định' };
    }
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
      <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'ĐƠN HÀNG'} text2={'CỦA TÔI'} />
        </div>
        <div className='flex justify-center items-center py-8'>
          <p className='text-gray-500'>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'ĐƠN HÀNG'} text2={'CỦA TÔI'} />
      </div>

      {/* ✅ Filter Tabs */}
      {orderUserList.length > 0 && (
        <div className='mb-6'>
          <div className='bg-white rounded-lg border p-4'>
            <h3 className='text-lg font-medium mb-4'>Lọc theo trạng thái:</h3>
            <div className='flex flex-wrap gap-3'>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${selectedStatus === option.value
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${selectedStatus === option.value
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                      }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Filter Results Info */}
      {orderUserList.length > 0 && (
        <div className='mb-4 text-sm text-gray-600'>
          {selectedStatus === 'all'
            ? `Hiển thị tất cả ${orderUserList.length} đơn hàng`
            : `Hiển thị ${filteredOrders.length} đơn hàng có trạng thái "${statusOptions.find(s => s.value === selectedStatus)?.label}"`
          }
        </div>
      )}

      {orderUserList.length === 0 ? (
        <div className='flex justify-center items-center py-8'>
          <p className='text-gray-500'>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='flex flex-col justify-center items-center py-8 bg-gray-50 rounded-lg'>
          <div className='text-6xl mb-4'>📦</div>
          <p className='text-gray-500 text-lg font-medium'>
            Không có đơn hàng nào với trạng thái "{statusOptions.find(s => s.value === selectedStatus)?.label}"
          </p>
          <button
            onClick={() => setSelectedStatus('all')}
            className='mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors'
          >
            Xem tất cả đơn hàng
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          {filteredOrders.map((order) => (
            <div key={order.orderId} className='border rounded-lg p-6 bg-white shadow-sm'>
              {/* Order Header */}
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b'>
                <div>
                  <h3 className='text-lg font-medium text-gray-800'>
                    Đơn hàng #{order.orderId}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    Ngày đặt: {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className='flex items-center gap-2 mt-2 sm:mt-0'>
                  <span className={`w-3 h-3 rounded-full ${getStatusInfo(order.status).color}`}></span>
                  <span className='text-sm font-medium'>{getStatusInfo(order.status).text}</span>
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

                  {/* ✅ Action buttons */}
                  <div className='flex flex-col sm:flex-row gap-2 mt-2 justify-end'>
                    <button
                      onClick={() => handleFetchOrderDetails(order.orderId)}
                      disabled={loadingDetails[order.orderId]}
                      className={`px-4 py-2 text-white text-sm rounded transition-colors ${loadingDetails[order.orderId]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : orderDetails[order.orderId]?.show
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-800 hover:bg-gray-900'
                        }`}
                    >
                      {loadingDetails[order.orderId]
                        ? 'Đang tải...'
                        : orderDetails[order.orderId]?.show
                          ? 'Ẩn chi tiết'
                          : 'Xem chi tiết'
                      }
                    </button>

                    {/* ✅ Cancel button - chỉ hiện với pending và processing */}
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={cancellingOrders[order.orderId]}
                        className={`px-4 py-2 text-white text-sm rounded transition-colors ${cancellingOrders[order.orderId]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                          }`}
                      >
                        {cancellingOrders[order.orderId] ? 'Đang hủy...' : 'Hủy đơn hàng'}
                      </button>
                    )}
                  </div>
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

export default Orders;