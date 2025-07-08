package techshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import techshop.dto.CartItemDTO;
import techshop.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/{user_id}/add")
    public ResponseEntity<String> addToCart(@PathVariable("user_id") Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        String result = cartService.addToCart(userId, productId, quantity);

        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // Lấy danh sách sản phẩm trong giỏ hàng
    @GetMapping("/{user_id}")
    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable("user_id") Long userId) {
        List<CartItemDTO> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(items);
    }

    // Cập nhật số lượng một sản phẩm
    @PutMapping("/{user_id}/item/{cart_detail_id}")
    public ResponseEntity<String> updateCartItemQuantity(@PathVariable("user_id") Long userId,
            @PathVariable("cart_detail_id") Long cartDetailId,
            @RequestParam Integer quantity) {
        String result = cartService.updateCartItemQuantity(userId, cartDetailId, quantity);

        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // Cập nhật nhiều sản phẩm cùng lúc
    @PutMapping("/{user_id}")
    public ResponseEntity<String> updateCartItems(@PathVariable("user_id") Long userId,
            @RequestBody List<CartItemDTO> cartItems) {
        String result = cartService.updateCartItems(userId, cartItems);

        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // Xóa một sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{user_id}/item/{cart_detail_id}")
    public ResponseEntity<String> removeCartItem(@PathVariable("user_id") Long userId,
            @PathVariable("cart_detail_id") Long cartDetailId) {
        String result = cartService.removeCartItem(userId, cartDetailId);

        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // Xóa tất cả sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{user_id}/clear")
    public ResponseEntity<String> clearCart(@PathVariable("user_id") Long userId) {
        String result = cartService.clearCart(userId);

        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

}
