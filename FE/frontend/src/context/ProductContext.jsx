import React, { createContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [token] = useState(localStorage.getItem('token'));
    const [branches, setBranches] = useState([]);

    // Upload ảnh, trả về đường dẫn ảnh
    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('/api/product/upload-image', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data; // Đường dẫn ảnh
        } catch {
            return null;
        }
    };

    // Lấy tất cả sản phẩm
    const fetchAllProducts = async () => {
        try {
            const res = await axios.get('/api/product', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch {

            return [];
        }
    };

    // Lấy sản phẩm theo ID
    const fetchProductById = async (productId) => {
        try {
            const res = await axios.get(`/api/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    // Thêm sản phẩm mới
    const createProduct = async (product) => {
        try {
            const payload = {
                ...product,
                image: product.image,
            };
            delete payload.imageFile;
            const res = await axios.post('/api/product', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    // Cập nhật sản phẩm
    const updateProduct = async (product) => {
        try {
            const payload = {
                ...product,
                image: product.image,
            };
            delete payload.imageFile;
            const res = await axios.post(`/api/product/${product.productId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    // Xóa sản phẩm
    const deleteProduct = async (productId) => {
        try {
            const res = await axios.delete(`/api/product/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch {
            return null;
        }
    };

    // ✅ Đảm bảo fetchAllBranches return data
    const fetchAllBranches = async () => {
        try {
            const res = await axios.get('/api/branch', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBranches(res.data);
            console.log('Fetched branches:', res.data); // ✅ Debug log
            return res.data;
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
            return [];
        }
    };

    const fetchBranchById = async (branchId) => {
        try {
            const res = await axios.get(`/api/branch/${branchId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched branch:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching branch by ID:', error);
            return null;
        }
    };

    // ✅ Thêm function update inventory
    const updateInventoryQuantity = async (inventoryId, newQuantity) => {
        try {
            const payload = {
                inventoryId: inventoryId,
                quantity: newQuantity
            };

            const res = await axios.put(`/api/branch/inventory/${inventoryId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Updated inventory:', res.data);
            return res.data;
        } catch (error) {
            console.error('Error updating inventory:', error);
            return null;
        }
    };

    // ✅ Thêm function update branch
    const updateBranch = async (branchId, branchData) => {
        try {
            const payload = {
                address: branchData.address,
                phone: branchData.phone
            };

            const res = await axios.put(`/api/branch/${branchId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Updated branch:', res.data);

            // ✅ Cập nhật local state branches nếu cần
            setBranches(prev =>
                prev.map(branch =>
                    branch.branchId === branchId
                        ? { ...branch, ...branchData }
                        : branch
                )
            );

            return res.data;
        } catch (error) {
            console.error('Error updating branch:', error);
            return null;
        }
    };

    // ✅ Thêm function create branch
    const createBranch = async (branchData) => {
        try {
            const payload = {
                address: branchData.address,
                phone: branchData.phone
            };

            const res = await axios.post('/api/branch', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Created branch:', res.data);

            // ✅ Refresh danh sách branches
            await fetchAllBranches();

            return res.data;
        } catch (error) {
            console.error('Error creating branch:', error);
            return null;
        }
    };

    // ✅ Thêm function delete branch
    const deleteBranch = async (branchId) => {
        try {
            const res = await axios.delete(`/api/branch/${branchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Deleted branch:', branchId);

            // ✅ Cập nhật local state
            setBranches(prev => prev.filter(branch => branch.branchId !== branchId));

            return true;
        } catch (error) {
            console.error('Error deleting branch:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchAllBranches();
    }, [token]);

    return (
        <ProductContext.Provider
            value={{
                fetchAllProducts,
                fetchProductById,
                createProduct,
                updateProduct,
                deleteProduct,
                uploadImage,
                fetchAllBranches,
                fetchBranchById,
                updateInventoryQuantity,
                updateBranch,        // ✅ Thêm function mới
                createBranch,        // ✅ Thêm function mới
                deleteBranch,        // ✅ Thêm function mới
                branches,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;