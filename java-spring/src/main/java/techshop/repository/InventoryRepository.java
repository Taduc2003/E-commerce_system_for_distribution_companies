package techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import techshop.domain.Inventory;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBranch_BranchIdAndProduct_ProductId(Long branchId, Long productId);

    List<Inventory> findByBranch_BranchId(Long branchId);

    List<Inventory> findByProduct_ProductId(Long productId);

    Inventory findByInventoryId(Long inventoryId);
}