package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Newsletter subscriptions.
 * Provides endpoints for unauthenticated users (e.g., from the footer) to subscribe.
 */
@RestController
@RequestMapping("/api/public/newsletter")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsletterRestController {

    private final NotificationService notificationService;

    public NewsletterRestController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * POST /api/public/newsletter/subscribe
     * Handles the subscription request from the React frontend footer.
     * Expects a JSON body: { "email": "user@example.com" }
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        try {
            if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Please enter a valid email address."
                ));
            }

            // Calls service to save to the generic subscription table
            notificationService.subscribeEmail(email);

            return ResponseEntity.ok(Map.of(
                    "message", "Thank you! You are now subscribed to our exclusive offers."
            ));

        } catch (IllegalStateException e) {
            String errorMessage = e.getMessage();

            // If the user is already a registered customer, guide them to the login flow
            if (errorMessage != null && errorMessage.contains("already registered as a customer")) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "You are already a registered customer. Please log in to manage your preferences.",
                        "code", "ALREADY_REGISTERED"
                ));
            }

            return ResponseEntity.badRequest().body(Map.of("error", errorMessage));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Subscription failed. Please try again later."
            ));
        }
    }
}