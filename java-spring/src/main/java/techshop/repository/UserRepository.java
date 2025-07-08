package techshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import techshop.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm user theo email
    User findByEmail(String email);
    
}


