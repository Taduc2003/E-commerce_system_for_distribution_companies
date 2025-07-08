package techshop.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import techshop.domain.Cart;
import techshop.domain.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser_UserId(Long userId);

    // List<Cart> findByUser_UserId(Long userId);

    // Cart findByUser_UserIdAndProduct_ProductId(Long userId, Long productId); // Correctly reference User.userId and Product.productId

}
