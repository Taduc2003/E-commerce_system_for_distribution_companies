import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Title from '../../components/user/Title';
import { assets } from '../../assets/assets';

const Profile = () => {
    const { user, uploadAvatar, updateUserProfile } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [removeAvatar, setRemoveAvatar] = useState(false); // ✅ Thêm state để track việc gỡ avatar

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load user data khi component mount
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }

            setAvatarFile(file);
            setRemoveAvatar(false); // ✅ Reset remove flag khi chọn ảnh mới
            // Tạo preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Function để gỡ avatar
    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setRemoveAvatar(true);
        // Reset file input
        const fileInput = document.getElementById('avatar-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Email không hợp lệ!');
            return;
        }

        // Validate phone
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        // Validate password nếu muốn đổi
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                alert('Vui lòng nhập mật khẩu hiện tại!');
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                alert('Mật khẩu mới không khớp!');
                return;
            }
            if (formData.newPassword.length < 6) {
                alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
                return;
            }
        }

        setLoading(true);
        try {
            let avatarPath = user.avatar; // Giữ avatar cũ mặc định

            // ✅ Logic đơn giản: gỡ avatar = null
            if (removeAvatar) {
                avatarPath = null;
                console.log('Removing avatar - setting to null');
            }
            // Upload avatar mới nếu có
            else if (avatarFile) {
                console.log('Uploading new avatar...');
                const uploadResult = await uploadAvatar(avatarFile);
                if (uploadResult) {
                    avatarPath = uploadResult;
                    console.log('Avatar uploaded successfully:', avatarPath);
                } else {
                    alert('Upload ảnh thất bại! Vui lòng thử lại.');
                    return;
                }
            }

            // ✅ Tạo updateData - đảm bảo avatar được set
            const updateData = {
                userId: user.userId, // ✅ Thêm userId để backend biết update user nào
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                avatar: avatarPath // null, string cũ, hoặc string mới
            };

            // Thêm password nếu có
            if (formData.newPassword) {
                updateData.password = formData.newPassword; // ✅ Sử dụng 'password' thay vì 'newPassword'
            }

            console.log('Updating user profile with data:', updateData);

            // ✅ Gọi updateUserProfile
            const result = await updateUserProfile(updateData);

            if (result) {
                alert('Cập nhật thông tin thành công!');
                setIsEditing(false);
                setAvatarFile(null);
                setAvatarPreview(null);
                setRemoveAvatar(false);
                // Reset password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                alert('Cập nhật thông tin thất bại! Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Cập nhật thông tin thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        setRemoveAvatar(false); // ✅ Reset remove flag
        // Reset form về dữ liệu gốc
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    // ✅ Function để hiển thị avatar đúng cách
    const getAvatarSrc = () => {
        if (removeAvatar) {
            return assets.profile_icon; // Hiển thị default avatar
        }
        if (avatarPreview) {
            return avatarPreview; // Hiển thị preview của file mới
        }
        if (user.avatar) {
            return `${backendUrl}${user.avatar}`; // Hiển thị avatar hiện tại
        }
        return assets.profile_icon; // Default avatar
    };

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    if (!user) {
        return (
            <div className='border-t pt-16'>
                <div className='text-center py-8'>
                    <p className='text-gray-500'>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl mb-8'>
                <Title text1={'THÔNG TIN'} text2={'CÁ NHÂN'} />
            </div>

            <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
                {/* Header */}
                <div className='bg-gray-50 px-6 py-4 border-b'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-lg font-medium text-gray-800'>
                            {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}
                        </h3>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors'
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className='p-6'>
                    {isEditing ? (
                        /* Edit Form */
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Avatar Upload */}
                            <div className='flex flex-col items-center space-y-4'>
                                <div className='relative'>
                                    <img
                                        src={getAvatarSrc()}
                                        alt="Avatar"
                                        className='w-24 h-24 rounded-full object-cover border-4 border-gray-200'
                                    />
                                    <div className='absolute bottom-0 right-0 bg-gray-600 text-white rounded-full p-1 cursor-pointer hover:bg-gray-700'>
                                        <label htmlFor="avatar-upload" className='cursor-pointer'>
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z'></path>
                                            </svg>
                                        </label>
                                    </div>
                                </div>

                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className='hidden'
                                />

                                {/* ✅ Avatar actions */}
                                <div className='flex flex-col items-center space-y-2'>
                                    <p className='text-sm text-gray-500 text-center'>
                                        Nhấp vào icon để thay đổi ảnh đại diện
                                    </p>

                                    {/* ✅ File status */}
                                    {avatarFile && (
                                        <span className='text-green-600 text-sm'>✓ Đã chọn: {avatarFile.name}</span>
                                    )}

                                    {removeAvatar && (
                                        <span className='text-red-600 text-sm'>✓ Sẽ gỡ ảnh đại diện hiện tại</span>
                                    )}

                                    {/* ✅ Action buttons */}
                                    <div className='flex gap-2 mt-2'>
                                        {(user.avatar || avatarFile) && !removeAvatar && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors'
                                            >
                                                Gỡ ảnh
                                            </button>
                                        )}

                                        {removeAvatar && (
                                            <button
                                                type="button"
                                                onClick={() => setRemoveAvatar(false)}
                                                className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'
                                            >
                                                Hủy gỡ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                    required
                                />
                            </div>

                            {/* Password Change Section */}
                            <div className='border-t pt-6'>
                                <h4 className='text-md font-medium text-gray-800 mb-4'>Đổi mật khẩu (tùy chọn)</h4>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                            placeholder='Nhập để thay đổi mật khẩu'
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                                placeholder='Ít nhất 6 ký tự'
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                                                placeholder='Nhập lại mật khẩu mới'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 pt-4'>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gray-800 hover:bg-gray-900'
                                        }`}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* View Mode */
                        <div className='space-y-6'>
                            {/* Avatar Display */}
                            <div className='flex justify-center'>
                                <img
                                    src={user.avatar ? `${backendUrl}${user.avatar}` : assets.profile_icon}
                                    alt="Avatar"
                                    className='w-24 h-24 rounded-full object-cover border-4 border-gray-200'
                                />
                            </div>

                            {/* User Info Display */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                                        Họ và tên
                                    </label>
                                    <p className='text-lg text-gray-800'>{user.fullName}</p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                                        Số điện thoại
                                    </label>
                                    <p className='text-lg text-gray-800'>{user.phone}</p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                                        Email
                                    </label>
                                    <p className='text-lg text-gray-800'>{user.email}</p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-500 mb-1'>
                                        Vai trò
                                    </label>
                                    <span className='inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full'>
                                        {user.role?.roleName === 'CUSTOMER' ? 'Khách hàng' : user.role?.roleName}
                                    </span>
                                </div>
                            </div>

                            {/* User ID */}
                            <div className='border-t pt-4'>
                                <label className='block text-sm font-medium text-gray-500 mb-1'>
                                    ID người dùng
                                </label>
                                <p className='text-gray-600'>#{user.userId}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
