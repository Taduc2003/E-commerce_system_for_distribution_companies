package techshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import techshop.domain.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Tìm role theo tên
    Optional<Role> findByRoleName(String name);
    
}
