package techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import techshop.domain.CartDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> findByCart_CartId(Long cartId);

    // Thêm method để tìm cart details theo IDs
    List<CartDetail> findByCartDetailIdIn(List<Long> cartDetailIds);

    // Tìm cart detail theo ID và verify thuộc về user
    CartDetail findByCartDetailIdAndCart_User_UserId(Long cartDetailId, Long userId);

    // Tìm cart detail theo cart và product (để check duplicate)
    Optional<CartDetail> findByCart_CartIdAndProduct_ProductId(Long cartId, Long productId);
    
    // Tìm cart details theo product ID
    List<CartDetail> findByProduct_ProductId(Long productId);

    Optional<CartDetail> findByCartDetailIdAndCart_CartId(Long cartDetailId, Long cartId);
    
}