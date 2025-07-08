import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../../context/ProductContext';
import BranchItem from '../../components/admin/BranchItem';
import Title from '../../components/user/Title';

const Branch = () => {
    const {
        branches,
        fetchAllBranches,
        createBranch,
        updateBranch,
        deleteBranch
    } = useContext(ProductContext);

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        phone: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadBranches = async () => {
            setLoading(true);
            await fetchAllBranches();
            setLoading(false);
        };
        loadBranches();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle create new branch
    const handleCreate = () => {
        setIsEditing(false);
        setEditingBranch(null);
        setFormData({ address: '', phone: '' });
        setShowModal(true);
    };

    // Handle edit branch
    const handleEdit = (branch) => {
        setIsEditing(true);
        setEditingBranch(branch);
        setFormData({
            address: branch.address,
            phone: branch.phone
        });
        setShowModal(true);
    };

    // Handle delete branch
    const handleDelete = async (branchId) => {
        const success = await deleteBranch(branchId);
        if (success) {
            alert('Xóa chi nhánh thành công!');
        } else {
            alert('Xóa chi nhánh thất bại!');
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.address.trim() || !formData.phone.trim()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setSaving(true);
        try {
            let result;
            if (isEditing) {
                result = await updateBranch(editingBranch.branchId, formData);
            } else {
                result = await createBranch(formData);
            }

            if (result) {
                alert(isEditing ? 'Cập nhật chi nhánh thành công!' : 'Tạo chi nhánh thành công!');
                setShowModal(false);
                setFormData({ address: '', phone: '' });
                setEditingBranch(null);
                setIsEditing(false);
                // Refresh data
                await fetchAllBranches();
            } else {
                alert(isEditing ? 'Cập nhật chi nhánh thất bại!' : 'Tạo chi nhánh thất bại!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setSaving(false);
        }
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ address: '', phone: '' });
        setEditingBranch(null);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className='p-6'>
                <div className='text-2xl mb-8'>
                    <Title text1={'QUẢN LÝ'} text2={'CHI NHÁNH'} />
                </div>
                <div className='flex justify-center items-center py-8'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                    <p className='text-gray-500 ml-4'>Đang tải danh sách chi nhánh...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6'>
            <div className='text-2xl mb-8'>
                <Title text1={'QUẢN LÝ'} text2={'CHI NHÁNH'} />
            </div>

            {/* Header with Create Button */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        Danh sách chi nhánh ({branches.length})
                    </h2>
                </div>
                <button
                    onClick={handleCreate}
                    className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors'
                >
                    Thêm chi nhánh
                </button>
            </div>

            {/* Branches Grid */}
            {branches.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {branches.map((branch) => (
                        <BranchItem
                            key={branch.branchId}
                            branch={branch}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className='text-center py-12'>
                    <div className='text-gray-400 text-6xl mb-4'>-</div>
                    <h3 className='text-xl font-medium text-gray-500 mb-2'>Chưa có chi nhánh nào</h3>
                    <p className='text-gray-400 mb-4'>Tạo chi nhánh đầu tiên để bắt đầu quản lý</p>
                    <button
                        onClick={handleCreate}
                        className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors'
                    >
                        Thêm chi nhánh đầu tiên
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                            {isEditing ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Địa chỉ chi nhánh
                                </label>
                                <input
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập địa chỉ chi nhánh...'
                                    required
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Số điện thoại
                                </label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Nhập số điện thoại...'
                                    required
                                />
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                    disabled={saving}
                                >
                                    Hủy
                                </button>
                                <button
                                    type='submit'
                                    disabled={saving}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${saving
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                >
                                    {saving
                                        ? (isEditing ? 'Đang cập nhật...' : 'Đang tạo...')
                                        : (isEditing ? 'Cập nhật' : 'Tạo mới')
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Branch;
