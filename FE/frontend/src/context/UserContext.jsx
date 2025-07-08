import axios from '../api/axiosInstance';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [staff, setStaff] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // Đăng nhập (AuthController)
    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);

            setUser(res.data.user);
            return res.data;
        } catch {
            return null;
        }
    };

    // Đăng xuất (AuthController)
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch { }
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('branchId');
    };

    // Đăng Ký
    const register = async (userData) => {
        try {
            const res = await axios.post('/api/user/sign-up', userData);
            return true;
        } catch {
            return false;
        }
    };

    // Lấy thông tin user hiện tại (AuthController)
    const fetchCurrentUser = async () => {
        if (!token) return null;
        try {
            const res = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    // Lấy thông tin user theo userId (UserController)
    const fetchUserById = async (userId) => {
        try {
            const res = await axios.get(`/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    // Lấy thông tin staff theo staffId (StaffController)
    const fetchStaffById = async (staffId) => {
        try {
            const res = await axios.get(`/api/staff/${staffId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(res.data);
            return res.data;
        } catch {
            setStaff(null);
            return null;
        }
    };

    // Lấy danh sách staff (StaffController)
    const fetchAllStaff = async () => {
        console.log("token staff", token)
        try {
            const res = await axios.get('/api/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch {
            return [];
        }
    };

    // ✅ Upload avatar (UserController)
    const uploadAvatar = async (file) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/user/upload-avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            return res.data; // Trả về file path
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error("Upload avatar thất bại");
            return null;
        }
    };

    // ✅ Update user profile function
    const updateUserProfile = async (userData) => {
        if (!token || !user) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }

        try {
            const updateData = {
                userId: user.userId,
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                avatar: userData.avatar
            };

            if (userData.password) {
                updateData.password = userData.password;
            }

            const res = await axios.put(`/api/user/${user.userId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // ✅ Kiểm tra email có thay đổi
            const emailChanged = userData.email !== user.email;

            setUser(res.data);

            if (emailChanged) {
                // ✅ Force logout và yêu cầu login lại
                toast.success("Cập nhật email thành công! Vui lòng đăng nhập lại với email mới.");

                setTimeout(() => {
                    logout(); // Clear token và user state
                    window.location.href = '/login';
                }, 2000);
            } else {
                toast.success("Cập nhật thông tin thành công!");
            }

            return res.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Cập nhật thông tin thất bại");
            }
            return null;
        }
    };


    // ✅ Create staff (StaffController)
    const createStaff = async (staffData) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }

        try {
            const res = await axios.post('/api/staff', staffData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Tạo staff thành công!");
            return res.data;
        } catch (error) {
            console.error('Error creating staff:', error);
            toast.error("Tạo staff thất bại");
            return null;
        }
    };

    // ✅ Update staff (StaffController)
    const updateStaff = async (staffId, staffData) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }

        try {
            const res = await axios.put(`/api/staff/${staffId}`, staffData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Cập nhật staff thành công!");
            return res.data;
        } catch (error) {
            console.error('Error updating staff:', error);
            toast.error("Cập nhật staff thất bại");
            return null;
        }
    };

    // ✅ Delete staff (StaffController)
    const deleteStaff = async (staffId) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return false;
        }

        try {
            await axios.delete(`/api/staff/${staffId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Xóa staff thành công!");
            return true;
        } catch (error) {
            console.error('Error deleting staff:', error);
            toast.error("Xóa staff thất bại");
            return false;
        }
    };

 
    useEffect(() => {
        fetchCurrentUser();
        // eslint-disable-next-line
    }, [token]);

    return (
        <UserContext.Provider
            value={{
                user,
                staff,
                token,
                login,
                logout,
                register,
                fetchCurrentUser,
                fetchUserById,
                fetchStaffById,
                fetchAllStaff,
                setUser,
                setStaff,
                uploadAvatar,
                updateUserProfile,
                createStaff,
                updateStaff,
                deleteStaff,

            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;