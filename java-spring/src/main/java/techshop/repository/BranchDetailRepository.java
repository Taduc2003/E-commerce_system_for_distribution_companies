package techshop.repository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import techshop.domain.BranchDetail;

@Repository
public interface BranchDetailRepository extends JpaRepository<BranchDetail, Long> {

    Optional<BranchDetail> findByUser_UserId(Long userId);
    
}
