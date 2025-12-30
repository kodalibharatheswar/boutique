package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.dto.RegistrationDTO;
import com.anvistudio.boutique.model.Address;
import com.anvistudio.boutique.model.Customer;
import com.anvistudio.boutique.model.Order;
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
 * REST Controller for Customer-specific functionality.
 * Replaces the Thymeleaf-based CustomerController.
 */
@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CustomerRestController {

    private final UserService userService;
    private final OrderService orderService;
    private final AddressService addressService;
    private final CouponService couponService;
    private final GiftCardService giftCardService;

    public CustomerRestController(UserService userService, OrderService orderService,
                                  AddressService addressService, CouponService couponService,
                                  GiftCardService giftCardService) {
        this.userService = userService;
        this.orderService = orderService;
        this.addressService = addressService;
        this.couponService = couponService;
        this.giftCardService = giftCardService;
    }

    /**
     * Helper to retrieve the authenticated User entity.
     */
    private User getAuthenticatedUser(UserDetails userDetails) {
        return userService.findUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    // =========================================================================
    // 1. Profile Management
    // =========================================================================

    /**
     * GET /api/customer/profile
     * Returns the customer's profile data for form pre-population.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<Customer> customerOpt = userService.getCustomerDetailsByUsername(userDetails.getUsername());
        if (customerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Customer profile not found."));
        }
        return ResponseEntity.ok(userService.getProfileDTOFromCustomer(customerOpt.get()));
    }

    /**
     * PUT /api/customer/profile
     * Updates the customer's personal details.
     */
    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RegistrationDTO profileDTO) {
        try {
            userService.updateCustomerProfile(userDetails.getUsername(), profileDTO);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/customer/profile/change-password
     * Securely updates the user's password.
     */
    @PostMapping("/profile/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> passwordData) {
        try {
            userService.changePassword(
                    userDetails.getUsername(),
                    passwordData.get("currentPassword"),
                    passwordData.get("newPassword"),
                    passwordData.get("confirmPassword")
            );
            return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =========================================================================
    // 2. Order History
    // =========================================================================

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(orderService.getOrdersByUserId(user.getId()));
    }

    @PostMapping("/orders/{orderId}/return")
    public ResponseEntity<Map<String, String>> requestReturn(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId) {
        try {
            // Future validation: ensure the order belongs to this user
            orderService.requestReturn(orderId);
            return ResponseEntity.ok(Map.of("message", "Return request submitted successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Could not process return request."));
        }
    }

    // =========================================================================
    // 3. Address Management
    // =========================================================================

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(addressService.getAddressesByUserId(user.getId()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<?> saveAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Address address) {
        try {
            User user = getAuthenticatedUser(userDetails);
            address.setUser(user); // Link the address to the current user
            Address saved = addressService.saveAddress(address);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error saving address."));
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // 4. Rewards & Offers
    // =========================================================================

    @GetMapping("/coupons")
    public ResponseEntity<?> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getAllActiveCoupons());
    }

    @GetMapping("/gift-cards")
    public ResponseEntity<?> getMyGiftCards(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(giftCardService.getGiftCardsByUsername(userDetails.getUsername()));
    }
}

