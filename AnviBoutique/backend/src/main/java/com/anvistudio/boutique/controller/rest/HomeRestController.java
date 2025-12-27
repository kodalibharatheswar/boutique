package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.ContactMessage;
import com.anvistudio.boutique.model.Customer;
import com.anvistudio.boutique.model.Product;
import com.anvistudio.boutique.service.ContactService;
import com.anvistudio.boutique.service.ProductService;
import com.anvistudio.boutique.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Public/Home functionality.
 * Provides data for the homepage and handles public submissions.
 */
@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HomeRestController {

    private final ProductService productService;
    private final ContactService contactService;
    private final UserService userService;

    public HomeRestController(ProductService productService, ContactService contactService, UserService userService) {
        this.productService = productService;
        this.contactService = contactService;
        this.userService = userService;
    }

    /**
     * GET /api/public/init
     * Fetches initial data for the landing page, including products and user context.
     * Replaces the logic from the old home() method.
     */
    @GetMapping("/init")
    public ResponseEntity<Map<String, Object>> getHomeData(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();

        // 1. Fetch products for the homepage grid
        List<Product> products = productService.getAllProducts();
        response.put("products", products);

        // 2. Fetch basic categories for navigation/filtering
        String[] categories = {
                "Sarees", "Lehengas", "Kurtis", "Long Frocks", "Mom & Me", "Crop Top – Skirts",
                "Handlooms", "Casual Frocks", "Ready To Wear", "Dupattas", "Kids wear",
                "Dress Material", "Blouses", "Fabrics"
        };
        response.put("categories", categories);

        // 3. Add User context if the user is currently logged in
        if (userDetails != null) {
            String username = userDetails.getUsername();
            Optional<Customer> customer = userService.getCustomerDetailsByUsername(username);

            Map<String, Object> userMap = new HashMap<>();
            userMap.HashMap("username", username);
            userMap.put("roles", userDetails.getAuthorities());
            userMap.put("displayName", customer.isPresent() ? customer.get().getFirstName() : "User");

            response.put("auth", userMap);
        } else {
            response.put("auth", null);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/public/contact
     * Processes contact message submissions via JSON.
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> handleContactSubmission(@RequestBody ContactMessage message) {
        try {
            contactService.saveMessage(message);
            return ResponseEntity.ok(Map.of(
                    "message", "Thank you for reaching out! Your message has been received."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "We couldn't save your message. Please try again later."
            ));
        }
    }

    /**
     * GET /api/public/policies
     * Optional: If you want to centralize policy metadata, though React often hardcodes these.
     */
    @GetMapping("/policies")
    public ResponseEntity<Map<String, String>> getPolicyLinks() {
        return ResponseEntity.ok(Map.of(
                "return", "/policy_return",
                "privacy", "/policy_privacy",
                "terms", "/policy_terms",
                "shipping", "/policy_shipping"
        ));
    }
}