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

    const fetchAllBranches = async () => {
        try {
            const res = await axios.get('/api/branch', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBranches(res.data);
            console.log('Branches fetched:', res.data);
            return res.data;
        } catch {
            setBranches([]);
            return [];
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
                branches,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;