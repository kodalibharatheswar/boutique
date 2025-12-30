package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.User;
import com.anvistudio.boutique.model.Wishlist;
import com.anvistudio.boutique.service.UserService;
import com.anvistudio.boutique.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Wishlist management.
 * Replaces the Thymeleaf-based WishlistController.
 */
@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WishlistRestController {

    private final WishlistService wishlistService;
    private final UserService userService;

    public WishlistRestController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    /**
     * GET /api/wishlist
     * Returns the authenticated user's wishlist items.
     */
    @GetMapping
    public ResponseEntity<?> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || "anonymousUser".equals(userDetails.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please log in to view your wishlist."));
        }

        try {
            User user = userService.findUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB."));

            // List<Wishlist> wishlistItems = wishlistService.getWishlistByUserId(user.getId());
            List<Wishlist> wishlistItems = wishlistService.getWishlistItems(user.getId());
            return ResponseEntity.ok(wishlistItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not fetch wishlist."));
        }
    }

    /**
     * POST /api/wishlist
     * Adds a product to the user's wishlist.
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> addToWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required."));
        }

        try {
            wishlistService.addToWishlist(userDetails.getUsername(), productId);
            return ResponseEntity.ok(Map.of("message", "Product added to your wishlist!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Could not add item: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/wishlist/{productId}
     * Removes a product from the user's wishlist.
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            User user = userService.findUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found."));

            wishlistService.removeFromWishlist(user.getId(), productId);
            return ResponseEntity.ok(Map.of("message", "Item removed from wishlist."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to remove item."));
        }
    }
}