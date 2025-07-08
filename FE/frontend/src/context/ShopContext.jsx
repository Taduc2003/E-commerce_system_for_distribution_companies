import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from '../api/axiosInstance';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "VNĐ";
    const deliveryFee = 25000;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [cartList, setCartList] = useState([]); // Danh sách chi tiết từ backend
    const [selectedItems, setSelectedItems] = useState([]); // ID các sản phẩm được chọn để mua
    const [orderUserList, setOrderUserList] = useState([]); // Danh sách đơn hàng của user

    const token = localStorage.getItem('token'); // Lấy token từ localStorage hoặc context auth
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage hoặc context auth
    const navigate = useNavigate();

    // Function định dạng giá
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    }

    // Lấy giỏ hàng từ backend
    const fetchCart = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`/api/cart/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartList(res.data);
            // Đồng bộ cartItems (id: quantity) cho FE
            const cartObj = {};
            res.data.forEach(item => {
                cartObj[item.productId] = item.quantity;
            });
            setCartItems(cartObj);
        } catch (e) {
            setCartList([]);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (productId, quantity = 1) => {
        console.log("Adding to cart:", userId, productId, quantity);
        if (!userId) return;
        try {
            await axios.post(`/api/cart/${userId}/add`, null, {
                params: { productId, quantity },
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        }
    };

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = async (cartDetailId, quantity) => {
        if (!userId) return;
        await axios.put(`/api/cart/${userId}/item/${cartDetailId}`, null, {
            params: { quantity },
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCart();
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeCartItem = async (cartDetailId) => {
        if (!userId) return;
        await axios.delete(`/api/cart/${userId}/item/${cartDetailId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCart();
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        if (!userId) return;
        await axios.delete(`/api/cart/${userId}/clear`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCart();
    };

    // Chọn/bỏ chọn sản phẩm muốn mua
    const toggleSelectItem = (cartDetailId) => {
        setSelectedItems(prev =>
            prev.includes(cartDetailId)
                ? prev.filter(id => id !== cartDetailId)
                : [...prev, cartDetailId]
        );
    };

    // Lấy tổng tiền các sản phẩm đã chọn
    const getSelectedTotal = () => {
        return cartList
            .filter(item => selectedItems.includes(item.cartDetailId))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (let productId in cartItems) {
            totalCount += cartItems[productId];
        }
        return totalCount;
    };

    // Tạo order từ cart
    const createOrder = async (orderData) => {
        if (!userId || !token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }

        try {
            const response = await axios.post(`/api/orders/create/${userId}`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Đặt hàng thành công!");
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
            return null;
        }
    };

    // Lấy orders của user
    const fetchUserOrders = async () => {

        try {
            const response = await axios.get(`/api/orders/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderUserList(response.data);

            return response.data;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            setOrderUserList([]);
            return [];
        }
    };

    // orderDetail theo orderId
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`/api/orders/${orderId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Order Details:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return [];
        }
    };

    // Lấy danh sách đơn hàng của chi nhánh
    const fetchBranchOrdersByStaff = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`/api/orders/staff/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Branch Orders:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching branch orders:", error);
            return [];
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        if (!userId || !token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }
        try {
            const response = await axios.put(`/api/orders/${orderId}/status?status=${status}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            return response.data;
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
            return null;
        }
    }

    // ✅ Thêm function hủy đơn hàng
    const cancelOrder = async (orderId) => {
        if (!userId || !token) {
            toast.error("Vui lòng đăng nhập");
            return null;
        }
        try {
            const response = await axios.put(`/api/orders/${orderId}/cancel`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Hủy đơn hàng thành công!");
            // ✅ Refresh danh sách orders sau khi hủy
            await fetchUserOrders();
            return response.data;
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
            return null;
        }
    }

    const fetchAllActiveDiscounts = async () => {
        try {
            const response = await axios.get('/api/discount', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Lọc ra các mã giảm giá còn thời gian hoạt động
            const currentDate = new Date();
            const activeDiscounts = response.data.filter(discount => {
                const startDate = new Date(discount.startDate);
                const endDate = new Date(discount.endDate);
                return currentDate >= startDate && currentDate <= endDate;
            });
            
            return activeDiscounts;
        } catch (error) {
            console.error("Error fetching discounts:", error);
            return [];
        }
    }

    useEffect(() => {
        fetchCart();
        fetchUserOrders();
        // ✅ Sửa lỗi thiếu ()
        fetchBranchOrdersByStaff();
        // eslint-disable-next-line
    }, [userId]);

    const value = {
        currency, deliveryFee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, updateQuantity, removeCartItem, clearCart,
        cartList, fetchCart, selectedItems, toggleSelectItem, getSelectedTotal,
        formatPrice, navigate, getCartCount,
        createOrder, fetchUserOrders, orderUserList, fetchOrderDetails, fetchBranchOrdersByStaff,
        updateOrderStatus, cancelOrder, 
        fetchAllActiveDiscounts,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;