package techshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import techshop.domain.*;
import techshop.domain.Order.OrderStatus;
import techshop.domain.Order.GetOrderMethod;
import techshop.dto.OrderDTO;
import techshop.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

     @Autowired
    private BranchDetailRepository branchDetailRepository;

    // Tạo order từ các sản phẩm được chọn trong cart
    @Transactional
    public Order createOrderFromCart(Long userId, OrderDTO orderDTO) {
        // Validation
        if (orderDTO.getBranchId() == null) {
            throw new RuntimeException("Branch ID is required");
        }

        if (orderDTO.getSelectedCartDetailIds() == null || orderDTO.getSelectedCartDetailIds().isEmpty()) {
            throw new RuntimeException("No items selected for order");
        }

        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm branch
        Branch branch = branchRepository.findById(orderDTO.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Lấy các cart details được chọn
        List<CartDetail> selectedCartDetails = cartDetailRepository
                .findByCartDetailIdIn(orderDTO.getSelectedCartDetailIds());

        if (selectedCartDetails.isEmpty()) {
            throw new RuntimeException("Selected cart items not found");
        }

        // Verify tất cả cart details thuộc về user này
        for (CartDetail cartDetail : selectedCartDetails) {
            if (!cartDetail.getCart().getUser().getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to cart items");
            }
        }

        // Kiểm tra inventory cho branch được chọn
        for (CartDetail cartDetail : selectedCartDetails) {
            Optional<Inventory> inventoryOpt = inventoryRepository
                    .findByBranch_BranchIdAndProduct_ProductId(branch.getBranchId(),
                            cartDetail.getProduct().getProductId());

            if (inventoryOpt.isEmpty()) {
                throw new RuntimeException("Product '" + cartDetail.getProduct().getProductName() +
                        "' is not available in branch: " + branch.getAddress());
            }

            Inventory inventory = inventoryOpt.get();
            if (inventory.getQuantity() < cartDetail.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + cartDetail.getProduct().getProductName() +
                                " in branch: " + branch.getAddress() +
                                ". Available: " + inventory.getQuantity() + ", Requested: " + cartDetail.getQuantity());
            }
        }

        // Tạo order
        Order order = new Order();
        order.setUser(user);
        order.setBranch(branch);
        order.setOrderDate(LocalDateTime.now().toLocalDate());
        order.setOrderDateTime(LocalDateTime.now().toLocalTime());
        order.setStatus(OrderStatus.Pending);
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setGetOrderMethod(orderDTO.getGetOrderMethod());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setTotalAmount(orderDTO.getTotalAmount());
        order = orderRepository.save(order);

        // Tạo order details từ selected cart details và update inventory
        for (CartDetail cartDetail : selectedCartDetails) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(cartDetail.getProduct());
            orderDetail.setQuantity(cartDetail.getQuantity());
            orderDetail.setPrice(cartDetail.getPrice());
            orderDetailRepository.save(orderDetail);
        

            // Update product quantity sold
            Product product = cartDetail.getProduct();
            product.setQuantitySold(product.getQuantitySold() + cartDetail.getQuantity());
            productRepository.save(product);

            // Update branch inventory
            Inventory inventory = inventoryRepository
                    .findByBranch_BranchIdAndProduct_ProductId(branch.getBranchId(), product.getProductId())
                    .orElseThrow(() -> new RuntimeException("Inventory not found"));

            inventory.setQuantity(inventory.getQuantity() - cartDetail.getQuantity());
            inventoryRepository.save(inventory);
        }

        // Xóa chỉ các cart details đã được order (không xóa toàn bộ cart)
        cartDetailRepository.deleteAll(selectedCartDetails);

        // Cập nhật lại tổng giá trị cart sau khi xóa một số items
        updateCartSum(user.getUserId());

        return order;
    }

    // Helper method để cập nhật tổng giá trị cart
    private void updateCartSum(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            List<CartDetail> remainingCartDetails = cartDetailRepository.findByCart_CartId(cart.getCartId());

            long newSum = 0;
            for (CartDetail cartDetail : remainingCartDetails) {
                newSum += cartDetail.getPrice().multiply(new BigDecimal(cartDetail.getQuantity())).longValue();
            }

            cart.setSum(newSum);
            cartRepository.save(cart);
        }
    }

    // Tạo order từ toàn bộ cart (method cũ cho backward compatibility)
    @Transactional
    public Order createOrderFromEntireCart(Long userId, OrderDTO orderDTO) {
        // Lấy tất cả cart details của user
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartDetail> allCartDetails = cartDetailRepository.findByCart_CartId(cart.getCartId());
        List<Long> allCartDetailIds = allCartDetails.stream()
                .map(CartDetail::getCartDetailId)
                .toList();

        // Set tất cả cart detail IDs vào DTO
        orderDTO.setSelectedCartDetailIds(allCartDetailIds);

        // Gọi method chính
        return createOrderFromCart(userId, orderDTO);
    }

    // ===== BRANCH-SPECIFIC METHODS =====

    // Lấy orders của một branch
    public List<Order> getOrdersByBranch(Long branchId) {
        return orderRepository.findByBranch_BranchId(branchId);
    }

    // Lấy orders của branch theo status
    public List<Order> getOrdersByBranchAndStatus(Long branchId, OrderStatus status) {
        return orderRepository.findByBranch_BranchIdAndStatus(branchId, status);
    }

    // Lấy doanh thu của branch
    public BigDecimal getBranchRevenue(Long branchId) {
        BigDecimal revenue = orderRepository.getTotalRevenueByBranch(branchId);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    // Lấy số lượng orders của branch
    public long getBranchOrderCount(Long branchId) {
        return orderRepository.countByBranch_BranchId(branchId);
    }

    // Lấy orders theo phương thức nhận hàng và branch
    public List<Order> getOrdersByMethodAndBranch(GetOrderMethod method, Long branchId) {
        return orderRepository.findByGetOrderMethodAndBranch_BranchId(method, branchId);
    }

    // ===== EXISTING METHODS (updated) =====

    // Lấy tất cả orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy order theo ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    // Lấy orders của user
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_UserId(userId);
    }

    // Lấy orders của user tại branch cụ thể
    public List<Order> getOrdersByStaff(Long staffId) {
        Optional<BranchDetail> branchDetail = branchDetailRepository.findByUser_UserId(staffId);
        
        Branch branch = branchDetail.get().getBranch();
        return orderRepository.findByBranch_BranchId(branch.getBranchId());
                
    }

    // Update order status (với logic khôi phục inventory khi cancel)
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        //Nếu order bị cancel, khôi phục inventory
        if (newStatus == OrderStatus.Cancelled && oldStatus != OrderStatus.Cancelled) {
            restoreInventoryForCancelledOrder(order);
        }

        return orderRepository.save(order);
    }

    // Cancel order với khôi phục inventory
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.Pending || order.getStatus() == OrderStatus.Processing) {
            order.setStatus(OrderStatus.Cancelled);
            restoreInventoryForCancelledOrder(order);
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
    }

    // Helper method để khôi phục inventory
    private void restoreInventoryForCancelledOrder(Order order) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrder_OrderId(order.getOrderId());

        for (OrderDetail detail : orderDetails) {
            // Restore product quantity sold
            Product product = detail.getProduct();
            product.setQuantitySold(product.getQuantitySold() - detail.getQuantity());
            productRepository.save(product);

            // Restore branch inventory
            Inventory inventory = inventoryRepository
                    .findByBranch_BranchIdAndProduct_ProductId(order.getBranch().getBranchId(), product.getProductId())
                    .orElseThrow(() -> new RuntimeException("Inventory not found"));

            inventory.setQuantity(inventory.getQuantity() + detail.getQuantity());
            inventoryRepository.save(inventory);
        }
    }

    // Get order details
    public List<OrderDetail> getOrderDetails(Long orderId) {
        return orderDetailRepository.findByOrder_OrderId(orderId);
    }

    // Delete order (admin only)
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Restore inventory if order was not cancelled
        if (order.getStatus() != OrderStatus.Cancelled) {
            restoreInventoryForCancelledOrder(order);
        }

        // Delete order details first
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrder_OrderId(orderId);
        orderDetailRepository.deleteAll(orderDetails);

        // Delete order
        orderRepository.delete(order);
    }
}