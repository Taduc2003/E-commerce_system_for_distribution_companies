package techshop.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import techshop.domain.User;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    /**
     * Load user by email (username) for Spring Security authentication
     * Spring Security sẽ gọi method này khi user login
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Tìm user trong database bằng email
        User user = userService.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // Trả về UserDetails object với thông tin user
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // username (sử dụng email)
                user.getPassword(), // password (đã mã hóa)
                getAuthorities(user) // authorities/roles
        );
    }

    /**
     * Chuyển đổi role của user thành GrantedAuthority cho Spring Security
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        // Tạo authority với format "ROLE_" + roleName
        String roleName = "ROLE_" + user.getRole().getRoleName().toUpperCase();
        return Collections.singletonList(new SimpleGrantedAuthority(roleName));
    }
}
