package techshop.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import techshop.domain.Cart;
import techshop.domain.CartDetail;
import techshop.domain.Product;
import techshop.domain.User;
import techshop.dto.CartItemDTO;
import techshop.repository.CartRepository;
import techshop.repository.CartDetailRepository;
import techshop.repository.ProductRepository;
import techshop.repository.UserRepository;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartDetailRepository cartDetailRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Thêm sản phẩm vào giỏ hàng
    @Transactional
    public String addToCart(Long userId, Long productId, Integer quantity) {
        try {
            // Validate input
            if (quantity <= 0) {
                return "Quantity must be greater than 0";
            }
            
            // Tìm user
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Tìm product
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Tìm hoặc tạo cart cho user
            Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> createCartForUser(user));
            
            // Kiểm tra sản phẩm đã có trong cart chưa
            Optional<CartDetail> existingCartDetailOpt = cartDetailRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), productId);
            
            if (existingCartDetailOpt.isPresent()) {
                // Nếu đã có thì cập nhật quantity
                CartDetail existingCartDetail = existingCartDetailOpt.get();
                existingCartDetail.setQuantity(existingCartDetail.getQuantity() + quantity);
                cartDetailRepository.save(existingCartDetail);
            } else {
                // Nếu chưa có thì tạo mới
                CartDetail cartDetail = new CartDetail(cart, product, quantity, product.getPrice());
                cartDetailRepository.save(cartDetail);
            }
            
            // Cập nhật tổng giá trị cart
            updateCartSum(cart.getCartId());
            
            return "Product added to cart successfully";
            
        } catch (Exception e) {
            return "Failed to add product to cart: " + e.getMessage();
        }
    }
    
    // Lấy danh sách sản phẩm trong giỏ hàng
    public List<CartItemDTO> getCartItems(Long userId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
        
        if (cartOpt.isEmpty()) {
            return new ArrayList<>();
        }
        
        Cart cart = cartOpt.get();
        List<CartDetail> cartDetails = cartDetailRepository.findByCart_CartId(cart.getCartId());
        
        List<CartItemDTO> cartItems = new ArrayList<>();
        for (CartDetail cartDetail : cartDetails) {
            Product product = cartDetail.getProduct();
            CartItemDTO item = new CartItemDTO(
                cartDetail.getCartDetailId(),
                product.getProductId(),
                product.getProductName(),
                product.getImage(),
                cartDetail.getPrice(),
                cartDetail.getQuantity(),
                product.getSupplier()
            );
            cartItems.add(item);
        }
        
        return cartItems;
    }
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @Transactional
    public String updateCartItemQuantity(Long userId, Long cartDetailId, Integer newQuantity) {
        try {
            Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
            if (cartOpt.isEmpty()) {
                return "Cart not found for user";
            }
            Cart cart = cartOpt.get();
            if (newQuantity <= 0) {
                return "Quantity must be greater than 0";
            }
            
            // Verify ownership and get cart detail
            Optional<CartDetail> cartDetailOpt = cartDetailRepository
                .findByCartDetailIdAndCart_CartId(cartDetailId, cart.getCartId());
            
            if (cartDetailOpt.isEmpty()) {
                return "Cart item not found or unauthorized access";
            }
            
            CartDetail cartDetail = cartDetailOpt.get();
            cartDetail.setQuantity(newQuantity);
            cartDetailRepository.save(cartDetail);
            
            // Cập nhật tổng giá trị cart
            updateCartSum(cartDetail.getCart().getCartId());
            
            return "Cart item updated successfully";
            
        } catch (Exception e) {
            return "Failed to update cart item: " + e.getMessage();
        }
    }
    
    // Cập nhật nhiều cart items cùng lúc
    @Transactional
    public String updateCartItems(Long userId, List<CartItemDTO> cartItems) {
        try {
            for (CartItemDTO item : cartItems) {
                String result = updateCartItemQuantity(userId, item.getCartDetailId(), item.getQuantity());
                if (!result.contains("successfully")) {
                    return result; // Return error message
                }
            }
            return "Cart updated successfully";
        } catch (Exception e) {
            return "Failed to update cart: " + e.getMessage();
        }
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    @Transactional
    public String removeCartItem(Long userId, Long cartDetailId) {
        try {
            Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
            if (cartOpt.isEmpty()) {
                return "Cart not found for user";
            }
            Cart cart = cartOpt.get();
            // Verify ownership and get cart detail
            Optional<CartDetail> cartDetailOpt = cartDetailRepository
                .findByCartDetailIdAndCart_CartId(cartDetailId, cart.getCartId());
            
            if (cartDetailOpt.isEmpty()) {
                return "Cart item not found or unauthorized access";
            }
            
            CartDetail cartDetail = cartDetailOpt.get();
           
            
            // Delete cart detail
            cartDetailRepository.delete(cartDetail);
            
            // Update cart sum
            updateCartSum(cart.getCartId());
            
            return "Cart item removed successfully";
            
        } catch (Exception e) {
            return "Failed to remove cart item: " + e.getMessage();
        }
    }
    
    // Xóa tất cả sản phẩm trong giỏ hàng
    @Transactional
    public String clearCart(Long userId) {
        try {
            Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
            
            if (cartOpt.isEmpty()) {
                return "Cart not found";
            }
            
            Cart cart = cartOpt.get();
            
            // Find all cart details and delete them one by one
            List<CartDetail> cartDetails = cartDetailRepository.findByCart_CartId(cart.getCartId());
            for (CartDetail cartDetail : cartDetails) {
                cartDetailRepository.delete(cartDetail);
            }
            
            // Reset cart sum
            cart.setSum(0);
            cartRepository.save(cart);
            
            return "Cart cleared successfully";
            
        } catch (Exception e) {
            return "Failed to clear cart: " + e.getMessage();
        }
    }
    
    
    // Helper methods
    private Cart createCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setSum(0);
        return cartRepository.save(cart);
    }
    
    private void updateCartSum(Long cartId) {
        List<CartDetail> cartDetails = cartDetailRepository.findByCart_CartId(cartId);
        
        BigDecimal sum = cartDetails.stream()
            .map(cd -> cd.getPrice().multiply(new BigDecimal(cd.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cart.setSum(sum.longValue());
            cartRepository.save(cart);
        }
    }
    
    // Get cart by user ID
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUser_UserId(userId).orElse(null);
    }
    
    // Check if product exists in cart
    public boolean isProductInCart(Long userId, Long productId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
        if (cartOpt.isEmpty()) {
            return false;
        }
        
        return cartDetailRepository
            .findByCart_CartIdAndProduct_ProductId(cartOpt.get().getCartId(), productId)
            .isPresent();
    }
}