package techshop.dto;

import techshop.domain.Order.GetOrderMethod;
import techshop.domain.Order.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

public class OrderDTO {
    private String shippingAddress;
    private GetOrderMethod getOrderMethod;
    private PaymentMethod paymentMethod;
    private Long discountId;
    private Long branchId;
    private List<Long> selectedCartDetailIds; // Thêm danh sách cart detail IDs được chọn
    private BigDecimal totalAmount; // Tổng số tiền của đơn hàn

    // Constructors
    public OrderDTO() {
    }

    public OrderDTO(String shippingAddress, GetOrderMethod getOrderMethod,
            PaymentMethod paymentMethod, Long branchId, List<Long> selectedCartDetailIds) {
        this.shippingAddress = shippingAddress;
        this.getOrderMethod = getOrderMethod;
        this.paymentMethod = paymentMethod;
        this.branchId = branchId;
        this.selectedCartDetailIds = selectedCartDetailIds;
    }

    // Getters and Setters
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public GetOrderMethod getGetOrderMethod() {
        return getOrderMethod;
    }

    public void setGetOrderMethod(GetOrderMethod getOrderMethod) {
        this.getOrderMethod = getOrderMethod;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Long getDiscountId() {
        return discountId;
    }

    public void setDiscountId(Long discountId) {
        this.discountId = discountId;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public List<Long> getSelectedCartDetailIds() {
        return selectedCartDetailIds;
    }

    public void setSelectedCartDetailIds(List<Long> selectedCartDetailIds) {
        this.selectedCartDetailIds = selectedCartDetailIds;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}