package techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import techshop.domain.Order;
import techshop.domain.Order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Tìm orders theo user ID
    List<Order> findByUser_UserId(Long userId);
    
    // Tìm orders theo status
    List<Order> findByStatus(OrderStatus status);
    
    // ===== BRANCH-RELATED QUERIES =====
    
    // Tìm orders theo branch ID
    List<Order> findByBranch_BranchId(Long branchId);
    
    // Tìm orders theo branch và status
    List<Order> findByBranch_BranchIdAndStatus(Long branchId, OrderStatus status);
    
    // Tìm orders theo branch và date range
    @Query("SELECT o FROM Order o WHERE o.branch.branchId = :branchId AND o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByBranchAndDateRange(@Param("branchId") Long branchId, 
                                        @Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    // Tổng doanh thu theo branch
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.branch.branchId = :branchId AND o.status = 'Completed'")
    BigDecimal getTotalRevenueByBranch(@Param("branchId") Long branchId);
    
    // Đếm số orders theo branch
    long countByBranch_BranchId(Long branchId);
    
    // Tìm orders theo user và branch
    List<Order> findByUser_UserIdAndBranch_BranchId(Long userId, Long branchId);
    
    // ===== EXISTING QUERIES =====
    
    // Tìm orders theo date range
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    // Tìm orders của user theo status
    List<Order> findByUser_UserIdAndStatus(Long userId, OrderStatus status);
    
    // Tìm orders theo payment method
    List<Order> findByPaymentMethod(Order.PaymentMethod paymentMethod);
    
    // Tổng số orders của user
    long countByUser_UserId(Long userId);
    
    // Tìm orders theo GetOrderMethod và branch (Pickup vs Delivery)
    List<Order> findByGetOrderMethodAndBranch_BranchId(Order.GetOrderMethod getOrderMethod, Long branchId);
}