package techshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import techshop.domain.User;
import techshop.dto.LoginRequest;
import techshop.dto.LoginResponse;
import techshop.utils.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user với Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            // Nếu authenticate thành công, load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

            // Lấy thông tin user từ database
            User user = userService.findByEmail(loginRequest.getEmail());

            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails, user.getUserId());

            // Tạo response
            return new LoginResponse(
                    token,
                    user.getUserId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole().getRoleName());

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }


    //Lấy thông tin user hiện tại từ JWT token
    public User getCurrentUser(String token) {
        try {
            // Bỏ "Bearer " prefix nếu có
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Validate token
            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid or expired token");
            }

            // Extract email từ token và tìm user
            String email = jwtUtil.getEmailFromToken(token);
            return userService.findByEmail(email);

        } catch (Exception e) {
            throw new RuntimeException("Failed to get current user: " + e.getMessage());
        }
    }

    /**
     * Lấy userId từ JWT token
     */
    public Long getCurrentUserId(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid or expired token");
            }

            return jwtUtil.getUserIdFromToken(token);

        } catch (Exception e) {
            throw new RuntimeException("Failed to get user ID: " + e.getMessage());
        }
    }
}
