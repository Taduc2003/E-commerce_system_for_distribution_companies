package techshop.repository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import techshop.domain.Branch;
import java.util.List;


@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    Branch findByAddress(String address);
}
