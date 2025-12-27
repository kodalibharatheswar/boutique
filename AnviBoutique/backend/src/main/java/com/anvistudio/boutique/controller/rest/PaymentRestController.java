package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.Address;
import com.anvistudio.boutique.model.CartItem;
import com.anvistudio.boutique.model.User;
import com.anvistudio.boutique.service.*;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Payment and Checkout flows.
 * Handles Stripe Intent creation and Order fulfillment.
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PaymentRestController {

    private final StripeService stripeService;
    private final CartService cartService;
    private final UserService userService;
    private final OrderService orderService;
    private final AddressService addressService;

    public PaymentRestController(StripeService stripeService, CartService cartService,
                                 UserService userService, OrderService orderService,
                                 AddressService addressService) {
        this.stripeService = stripeService;
        this.cartService = cartService;
        this.userService = userService;
        this.orderService = orderService;
        this.addressService = addressService;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userService.findUserByUsername(userDetails.getUsername()).orElse(null);
    }

    /**
     * GET /api/payment/checkout-data
     * Provides the React frontend with cart items, addresses, and the Stripe clientSecret.
     */
    @GetMapping("/checkout-data")
    public ResponseEntity<Map<String, Object>> getCheckoutData(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<CartItem> cartItems = cartService.getCartItems(user.getId());
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Your cart is empty."));
        }

        double totalPrice = cartService.getCartTotal(user.getId());
        List<Address> addresses = addressService.getAddressesByUserId(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("cartItems", cartItems);
        response.put("totalPrice", totalPrice);
        response.put("addresses", addresses);

        try {
            // Create Stripe PaymentIntent and provide the clientSecret to React
            String clientSecret = stripeService.createPaymentIntent(totalPrice);
            response.put("stripeClientSecret", clientSecret);
        } catch (StripeException e) {
            response.put("stripeError", "Could not initialize Stripe: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/payment/finalize
     * Finalizes the order after successful Stripe payment or selection of COD.
     */
    @PostMapping("/finalize")
    @Transactional
    public ResponseEntity<Map<String, String>> finalizeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> requestData) {

        User user = getAuthenticatedUser(userDetails);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Long addressId = Long.parseLong(requestData.get("addressId"));
            String paymentMode = requestData.get("paymentMode"); // "CARD" or "COD"
            String stripeIntentId = requestData.get("stripeIntentId");

            // 1. Fetch Cart Items
            List<CartItem> cartItems = cartService.getCartItems(user.getId());
            if (cartItems.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No items in cart to fulfill."));
            }

            // 2. Fetch Shipping Address
            Address address = addressService.getAddressById(addressId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Address ID."));

            // 3. Fulfill Order via Service logic
            orderService.fulfillOrder(user, cartItems, address, paymentMode, stripeIntentId);

            // 4. Clear Cart
            cartService.clearCart(user.getId());

            String message = "COD".equalsIgnoreCase(paymentMode)
                    ? "Order placed successfully (Cash on Delivery)."
                    : "Payment confirmed! Your order has been placed.";

            return ResponseEntity.ok(Map.of("message", message));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Order fulfillment failed: " + e.getMessage()));
        }
    }
}