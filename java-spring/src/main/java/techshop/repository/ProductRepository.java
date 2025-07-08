package techshop.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import techshop.domain.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
