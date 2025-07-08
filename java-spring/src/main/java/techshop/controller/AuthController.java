package techshop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import techshop.dto.LoginRequest;
import techshop.dto.LoginResponse;
import techshop.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * API đăng nhập
     * 
     * @param loginRequest thông tin đăng nhập (email, password)
     * @return JWT token và thông tin user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Gọi service để xử lý login
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Trả về error message nếu login thất bại
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API lấy thông tin user hiện tại
     * Yêu cầu JWT token trong Authorization header
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            // Lấy thông tin user từ token
            var currentUser = authService.getCurrentUser(token);
            return ResponseEntity.ok(currentUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API lấy userId hiện tại
     */
    @GetMapping("/user-id")
    public ResponseEntity<?> getCurrentUserId(@RequestHeader("Authorization") String token) {
        try {
            Long userId = authService.getCurrentUserId(token);
            return ResponseEntity.ok(userId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API đăng xuất (logout)
     * Trong JWT stateless system, logout chỉ cần xóa token ở client
     * Server không cần lưu trữ gì
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Clear SecurityContext
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully. Please remove token from client storage.");
    }

    /**
     * API kiểm tra user có đang đăng nhập không
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.ok("User is authenticated: " + authentication.getName());
        } else {
            return ResponseEntity.badRequest().body("User is not authenticated");
        }
    }
}
