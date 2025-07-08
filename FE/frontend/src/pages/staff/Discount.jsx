import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axiosInstance';
import DiscountForm from '../../components/staff/DiscountForm';
import DiscountCard from '../../components/staff/DiscountCard';
import { UserContext } from '../../context/UserContext';
import Title from '../../components/user/Title'; // ✅ Sửa typo từ Tilte thành Title

const Discount = () => {
  const [discountList, setDiscountList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  const { token } = useContext(UserContext);

  // Fetch discounts từ API
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/discount', {
        headers: { 'Authorization': `Bearer ${token}`, }
      });
      setDiscountList(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
      } else {
        alert('Có lỗi xảy ra khi tải danh sách mã giảm giá!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    // ✅ Chỉ fetch khi có token
    if (token) {
      fetchDiscounts();
    }
  }, [token]);

  console.log('Discount List:', discountList);

  // Handle thêm mới
  const handleAddNew = () => {
    setEditingDiscount(null);
    setShowForm(true);
  };

  // Handle chỉnh sửa
  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setShowForm(true);
  };

  // Handle lưu (thêm mới hoặc cập nhật)
  const handleSave = async (discountData) => {
    try {
      if (editingDiscount) {
        // Cập nhật
        await axios.put(`/api/discount/${editingDiscount.discountId}`, discountData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Cập nhật mã giảm giá thành công!');
      } else {
        // Thêm mới
        await axios.post('/api/discount', discountData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Thêm mã giảm giá thành công!');
      }

      setShowForm(false);
      setEditingDiscount(null);
      fetchDiscounts(); // Reload data
    } catch (error) {
      console.error('Error saving discount:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!');
      } else {
        alert('Có lỗi xảy ra khi lưu mã giảm giá!');
      }
    }
  };

  // Handle xóa
  const handleDelete = async (discountId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      return;
    }

    try {
      await axios.delete(`/api/discount/${discountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Xóa mã giảm giá thành công!');
      fetchDiscounts(); // Reload data
    } catch (error) {
      console.error('Error deleting discount:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/login';
      } else {
        alert('Có lỗi xảy ra khi xóa mã giảm giá!');
      }
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  // ✅ Hiển thị loading nếu chưa có token
  if (!token) {
    return (
      <div className='p-6'> {/* ✅ Thêm padding để thống nhất */}
        <div className='text-2xl mb-8'>
          <Title text1={'QUẢN LÝ'} text2={'MÃ GIẢM GIÁ'} />
        </div>
        <div className='flex justify-center items-center py-12'>
          <div className='text-center'>
            <p className='text-gray-500'>Đang xác thực...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'> {/* ✅ Thống nhất padding */}
      {/* ✅ Thống nhất: Title ở đầu, không có flex justify-between */}
      <div className='text-2xl mb-8'>
        <Title text1={'QUẢN LÝ'} text2={'MÃ GIẢM GIÁ'} />
      </div>

      {/* ✅ Button riêng biệt */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddNew}
          className='bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Thêm mã giảm giá
        </button>
      </div>

      {/* Stats */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Tổng số mã giảm giá</h3>
            <p className='text-3xl font-bold text-blue-600 mt-1'>{discountList.length}</p>
          </div>
          <div className='text-4xl text-blue-500'>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 173 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
            <p className='text-gray-500'>Đang tải danh sách mã giảm giá...</p>
          </div>
        </div>
      ) : discountList.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-6xl text-gray-300 mb-4'>
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 173 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Chưa có mã giảm giá nào</h3>
          <p className='text-gray-500 mb-6'>Hãy tạo mã giảm giá đầu tiên để thu hút khách hàng</p>
          <button
            onClick={handleAddNew}
            className='bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium'
          >
            Tạo mã giảm giá đầu tiên
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.isArray(discountList) && discountList.map((discount) => (
            <DiscountCard
              key={discount.discountId}
              discount={discount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DiscountForm
          discount={editingDiscount}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={!!editingDiscount}
        />
      )}
    </div>
  );
};

export default Discount;
