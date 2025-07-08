package techshop.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import techshop.domain.User;
import techshop.service.UserService;
import techshop.utils.JwtUtil;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        // Kiểm tra có Bearer token không
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                // Lấy token (bỏ "Bearer " prefix)
                String token = authHeader.substring(7);
                
                // Validate token
                if (jwtUtil.validateToken(token)) {
                    // Lấy email từ token
                    String email = jwtUtil.getEmailFromToken(token);
                    
                    // Tìm user trong database
                    User user = userService.findByEmail(email);
                    
                    if (user != null) {
                        // Tạo authority với role
                        String roleName = "ROLE_" + user.getRole().getRoleName().toUpperCase();
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
                        
                        // Tạo authentication token
                        UsernamePasswordAuthenticationToken auth = 
                            new UsernamePasswordAuthenticationToken(
                                user.getEmail(), 
                                null, 
                                Collections.singletonList(authority)
                            );
                        
                        // Set authentication vào SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
                
            } catch (Exception e) {
                // Token không hợp lệ - không làm gì, để Spring Security xử lý
                logger.error("JWT validation error: " + e.getMessage());
            }
        }
        
        // Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
}