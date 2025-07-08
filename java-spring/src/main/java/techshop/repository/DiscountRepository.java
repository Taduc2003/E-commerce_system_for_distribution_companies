package techshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import techshop.domain.Discount;


@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Optional<Discount> findById(Long discountId);

    // Kiểm tra code đã tồn tại chưa
    boolean existsByCode(String code);
}
