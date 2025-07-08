package techshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import techshop.domain.Order;
import techshop.domain.OrderDetail;
import techshop.domain.Order.OrderStatus;
import techshop.domain.Order.GetOrderMethod;
import techshop.dto.OrderDTO;
import techshop.service.OrderService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Tạo order từ cart với branch
    @PostMapping("/create/{userId}")
    public ResponseEntity<Order> createOrder(@PathVariable Long userId, @RequestBody OrderDTO orderDTO) {
        try {
            if (orderDTO.getBranchId() == null) {
                return ResponseEntity.badRequest().build();
            }
            Order order = orderService.createOrderFromCart(userId, orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== BRANCH-SPECIFIC ENDPOINTS =====

    // Lấy doanh thu của branch
    @GetMapping("/branch/{branchId}/revenue")
    public ResponseEntity<BigDecimal> getBranchRevenue(@PathVariable Long branchId) {
        BigDecimal revenue = orderService.getBranchRevenue(branchId);
        return ResponseEntity.ok(revenue);
    }

    // Lấy orders theo phương thức nhận hàng và branch
    @GetMapping("/branch/{branchId}/method/{method}")
    public ResponseEntity<List<Order>> getOrdersByMethodAndBranch(
            @PathVariable Long branchId, @PathVariable GetOrderMethod method) {
        List<Order> orders = orderService.getOrdersByMethodAndBranch(method, branchId);
        return ResponseEntity.ok(orders);
    }

    // Lấy orders của user tại branch cụ thể
    @GetMapping("/staff/{staff_id}")
    public ResponseEntity<List<Order>> getOrdersByStaff(@PathVariable("staff_id") Long staffId) {
        List<Order> orders = orderService.getOrdersByStaff(staffId);
        return ResponseEntity.ok(orders);
    }

    // ===== EXISTING ENDPOINTS =====

    // Lấy tất cả orders (Admin)
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Lấy order theo ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Optional<Order> order = orderService.getOrderById(orderId);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Lấy orders của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Cancel order
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId) {
        try {
            Order cancelledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy order details
    @GetMapping("/{orderId}/details")
    public ResponseEntity<List<OrderDetail>> getOrderDetails(@PathVariable Long orderId) {
        List<OrderDetail> orderDetails = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    // Delete order (Admin only)
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}