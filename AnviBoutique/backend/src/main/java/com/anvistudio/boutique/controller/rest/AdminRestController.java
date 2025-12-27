package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.Product;
import com.anvistudio.boutique.model.Order;
import com.anvistudio.boutique.model.Review;
import com.anvistudio.boutique.model.User;
import com.anvistudio.boutique.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Admin functionality.
 * This handles all administrative actions via JSON API.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminRestController {

    private final ProductService productService;
    private final UserService userService;
    private final ContactService contactService;
    private final OrderService orderService;
    private final ReviewService reviewService;

    public AdminRestController(ProductService productService, UserService userService, ContactService contactService,
                               OrderService orderService, ReviewService reviewService) {
        this.productService = productService;
        this.userService = userService;
        this.contactService = contactService;
        this.orderService = orderService;
        this.reviewService = reviewService;
    }

    // =========================================================================
    // 1. Dashboard & General Data
    // =========================================================================

    /**
     * GET /api/admin/status
     * Checks if the admin needs to update default credentials.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAdminStatus(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        String username = userDetails.getUsername();

        boolean needsUpdate = "admin".equals(username) && !userService.isAdminCredentialsUpdated(username);
        response.put("needsCredentialUpdate", needsUpdate);
        response.put("username", username);

        return ResponseEntity.ok(response);
    }

    // =========================================================================
    // 2. Order Management
    // =========================================================================

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/orders/{orderId}/status")
    public ResponseEntity<Map<String, String>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam("newStatus") String newStatus) {

        Map<String, String> response = new HashMap<>();
        try {
            Order order = orderService.getOrderById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found."));

            order.setStatus(Order.OrderStatus.valueOf(newStatus));
            orderService.saveOrder(order);

            response.put("message", "Order #" + orderId + " status updated to " + newStatus);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/orders/{orderId}/finalize-return")
    public ResponseEntity<Map<String, String>> finalizeReturn(@PathVariable Long orderId) {
        Map<String, String> response = new HashMap<>();
        try {
            Order order = orderService.getOrderById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found."));

            if (order.getStatus() != Order.OrderStatus.RETURN_REQUESTED) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Order must be in RETURN_REQUESTED state."));
            }

            order.setStatus(Order.OrderStatus.RETURNED);
            orderService.saveOrder(order);

            response.put("message", "Return finalized for order #" + orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // =========================================================================
    // 3. Review Moderation
    // =========================================================================

    @GetMapping("/reviews/unapproved")
    public ResponseEntity<List<Review>> getUnapprovedReviews() {
        return ResponseEntity.ok(reviewService.getUnapprovedReviews());
    }

    @PostMapping("/reviews/{reviewId}/approve")
    public ResponseEntity<Map<String, String>> approveReview(@PathVariable Long reviewId) {
        try {
            reviewService.approveReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Review approved."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Review deleted."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =========================================================================
    // 4. Product Management
    // =========================================================================

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getInventory(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.getProductsByCategoryOrAll(category));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.saveProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =========================================================================
    // 5. Contact Messages
    // =========================================================================

    @GetMapping("/contacts")
    public ResponseEntity<List<?>> getAllContactMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> deleteContactMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // 6. Admin Profile
    // =========================================================================

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateAdminProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> updates) {

        try {
            userService.updateAdminCredentials(
                    userDetails.getUsername(),
                    updates.get("newUsername"),
                    updates.get("newPassword"),
                    updates.get("recoveryPhoneNumber")
            );
            return ResponseEntity.ok(Map.of("message", "Credentials updated. Please re-login."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}