import React, { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import CartTotal from '../../components/user/CartTotal'
import OrderSummary from '../../components/user/OrderSummary'
import ShippingInfo from '../../components/user/ShippingInfo'
import PaymentMethod from '../../components/user/PaymentMethod'
import DiscountSelector from '../../components/user/DiscountSelector' // ✅ Import DiscountSelector
import { ShopContext } from '../../context/ShopContext'
import { UserContext } from '../../context/UserContext'
import { ProductContext } from '../../context/ProductContext'

const PlaceOrder = () => {
    const { navigate, cartList, getSelectedTotal, formatPrice, currency, createOrder } = useContext(ShopContext);
    const location = useLocation();
    const selectedItemIds = location.state?.selectedItems || [];
    const { user } = useContext(UserContext);

    const [deliveryMethod, setDeliveryMethod] = useState('delivery');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null); // ✅ State cho discount

    // Chỉ cần lấy branches từ ProductContext
    const { branches } = useContext(ProductContext);

    // Form data states
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        note: '',
        city: '',
        district: '',
        address: ''
    });

    // Lấy sản phẩm đã chọn
    useEffect(() => {
        const selected = cartList.filter(item => selectedItemIds.includes(item.cartDetailId));
        setSelectedProducts(selected);
        console.log('🛒 Selected products:', selected);
    }, [cartList, selectedItemIds]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ Handle discount change
    const handleDiscountChange = (discount) => {
        setSelectedDiscount(discount);
        console.log('Selected discount:', discount);
    };

    // ✅ Tính total với discount - cập nhật
    const getTotalWithDiscount = () => {
        const subtotal = getSelectedTotal();

        if (!selectedDiscount || !selectedDiscount.discountPercentage || subtotal <= 0) return subtotal;

        // Chỉ có percentage discount
        const discountAmount = (subtotal * selectedDiscount.discountPercentage) / 100;
        return Math.max(0, subtotal - Math.floor(discountAmount));
    };

    // ✅ Tính final total với phí giao hàng
    const getFinalTotal = () => {
        const totalAfterDiscount = getTotalWithDiscount();
        const deliveryFee = deliveryMethod === 'pickup' ? 0 : 25000;
        return totalAfterDiscount + deliveryFee;
    };

    // ✅ Đơn giản hóa validation
    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.phone) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return false;
        }

        if (deliveryMethod === 'delivery') {
            if (!formData.city || !formData.district || !formData.address) {
                alert('Vui lòng điền đầy đủ địa chỉ giao hàng');
                return false;
            }
        } else if (deliveryMethod === 'pickup') {
            if (!selectedBranch) {
                alert('Vui lòng chọn chi nhánh nhận hàng');
                return false;
            }
        }

        if (selectedItemIds.length === 0) {
            alert('Không có sản phẩm nào được chọn');
            return false;
        }

        return true;
    };

    // Handle order creation
    const handleCreateOrder = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Tạo shipping address
            let shippingAddress = '';
            if (deliveryMethod === 'delivery') {
                shippingAddress = `${formData.address}, ${formData.district}, ${formData.city}`;
            } else {
                const selectedBranchData = branches.find(b => b.branchId.toString() === selectedBranch);
                shippingAddress = selectedBranchData ? selectedBranchData.address : '';
            }

            // ✅ Tạo order data với discount
            const orderData = {
                shippingAddress: shippingAddress,
                getOrderMethod: deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup',
                paymentMethod: paymentMethod === 'cod' ? 'Cash' : 'Credit_Card',
                branchId: deliveryMethod === 'pickup' ? parseInt(selectedBranch) : 1,
                discountId: selectedDiscount ? selectedDiscount.discountId : null, // ✅ Thêm discountId
                selectedCartDetailIds: selectedItemIds,
                totalAmount: getFinalTotal() // ✅ Sử dụng final total với discount
            };

            console.log('Creating order with data:', orderData);

            const result = await createOrder(orderData);

            if (result) {
                window.location.href = '/orders';
            }
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    return (
        <div className='flex flex-col gap-8 pt-5 sm:pt-10 max-w-4xl mx-auto px-4'>
            {/* 1. SẢN PHẨM ĐÃ CHỌN */}
            <OrderSummary
                selectedProducts={selectedProducts}
                backendUrl={backendUrl}
                formatPrice={formatPrice}
                currency={currency}
            />

            {/* 2. THÔNG TIN GIAO HÀNG */}
            <ShippingInfo
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                formData={formData}
                handleInputChange={handleInputChange}
                branches={branches}
                selectedProducts={selectedProducts}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
            />

            {/* 3. TỔNG GIỎ HÀNG VÀ THANH TOÁN */}
            <div className='border rounded-lg p-6 bg-white shadow-sm'>
                {/* ✅ Thêm DiscountSelector */}
                <div className='mb-6'>
                    <DiscountSelector
                        selectedDiscount={selectedDiscount}
                        onDiscountChange={handleDiscountChange}
                        orderTotal={getSelectedTotal()}
                    />
                </div>

                <CartTotal
                    total={getSelectedTotal()}
                    deliveryMethod={deliveryMethod}
                    selectedDiscount={selectedDiscount} // ✅ Truyền discount
                />

                <PaymentMethod
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />

                {/* Nút đặt hàng */}
                <button
                    onClick={handleCreateOrder}
                    disabled={isLoading}
                    className={`w-full py-4 text-lg font-medium rounded transition-colors ${isLoading
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                        }`}
                >
                    {isLoading ? 'ĐANG XỬ LÝ...' : `ĐẶT HÀNG (${selectedProducts.length} sản phẩm) - ${formatPrice(getFinalTotal())} ${currency}`}
                </button>
            </div>
        </div>
    )
}

export default PlaceOrder
