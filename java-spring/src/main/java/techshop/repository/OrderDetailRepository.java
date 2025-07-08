package techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import techshop.domain.OrderDetail;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    // Tìm order details theo order ID
    List<OrderDetail> findByOrder_OrderId(Long orderId);

    // Tìm order details theo product ID
    List<OrderDetail> findByProduct_ProductId(Long productId);

    // Xóa order details theo order ID
    void deleteByOrder_OrderId(Long orderId);

    // Đếm số lượng order details theo order
    long countByOrder_OrderId(Long orderId);

    // Tìm order detail theo order và product
    OrderDetail findByOrder_OrderIdAndProduct_ProductId(Long orderId, Long productId);
}