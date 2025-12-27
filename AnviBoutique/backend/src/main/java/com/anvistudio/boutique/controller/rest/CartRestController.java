package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.CartItem;
import com.anvistudio.boutique.model.User;
import com.anvistudio.boutique.service.CartService;
import com.anvistudio.boutique.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Shopping Cart management.
 * Provides endpoints for React to fetch, add, update, and remove cart items.
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartRestController {

    private final CartService cartService;
    private final UserService userService;

    public CartRestController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    /**
     * Helper to get the authenticated User object.
     */
    private User getAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userService.findUserByUsername(userDetails.getUsername()).orElse(null);
    }

    /**
     * GET /api/cart
     * Returns the current user's cart items and total price.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);

        if (user == null) {
            // Frontend can use this 401 to show 'Guest Cart' (localStorage) or redirect to login
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CartItem> items = cartService.getCartItems(user.getId());
        double total = cartService.getCartTotal(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/cart/add
     * Adds a product to the user's cart.
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addItemToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "You must be logged in to add items to your cart."));
        }

        try {
            cartService.addProductToCart(userDetails.getUsername(), productId, quantity);
            return ResponseEntity.ok(Map.of("message", "Item added to cart successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error adding item: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/cart/items/{itemId}
     * Removes an item from the cart completely.
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> removeItemFromCart(@PathVariable Long itemId) {
        try {
            cartService.removeItem(itemId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to remove item."));
        }
    }

    /**
     * PUT /api/cart/items/{itemId}
     * Updates the quantity of an existing item in the cart.
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity) {

        try {
            if (quantity <= 0) {
                cartService.removeItem(itemId);
                return ResponseEntity.ok(Map.of("message", "Item removed because quantity was 0."));
            }

            cartService.updateItemQuantity(itemId, quantity);
            return ResponseEntity.ok(Map.of("message", "Cart item quantity updated."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update quantity."));
        }
    }
}