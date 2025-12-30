package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.service.UserService;
import com.anvistudio.boutique.dto.RegistrationDTO;
import com.anvistudio.boutique.model.Customer;
import com.anvistudio.boutique.model.User;
import com.anvistudio.boutique.model.VerificationToken.TokenType;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Authentication and Registration.
 * Replaces the Thymeleaf-based AuthController.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthRestController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager; // ← ADD THIS

    public AuthRestController(UserService userService,AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager=authenticationManager;
    }

    // =========================================================================
    // 1. REGISTRATION FLOW
    // =========================================================================

    /**
     * POST /api/auth/register
     * Handles customer registration and triggers OTP email.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerCustomer(@Valid @RequestBody RegistrationDTO registrationDTO) {
        Map<String, Object> response = new HashMap<>();
        try {
            User savedUser = userService.registerCustomer(registrationDTO);

            // Ensure security context is clear (no auto-login)
            SecurityContextHolder.clearContext();

            response.put("message", "Registration successful. Please verify the OTP sent to your email.");
            response.put("email", savedUser.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalStateException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("error", "An unexpected error occurred during registration.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // =========================================================================
    // 2. REGISTRATION OTP CONFIRMATION
    // =========================================================================

    /**
     * POST /api/auth/confirm-otp
     * Processes the submitted OTP for account activation.
     */
    @PostMapping("/confirm-otp")
    public ResponseEntity<Map<String, String>> confirmOtp(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp) {

        String result = userService.confirmUserAccountWithOtp(otp, email);

        if (result.startsWith("Verification successful")) {
            return ResponseEntity.ok(Map.of("message", result));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", result));
        }
    }

    // =========================================================================
    // 3. FORGOT PASSWORD FLOW
    // =========================================================================

    /**
     * POST /api/auth/forgot-password
     * Initiates the password reset process by sending an OTP.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> processForgotPasswordRequest(@RequestParam("identifier") String identifier) {
        try {
            User user = userService.findAndCreateResetOtp(identifier);
            return ResponseEntity.ok(Map.of(
                    "message", "An OTP has been sent to your registered email.",
                    "email", user.getUsername()
            ));
        } catch (UsernameNotFoundException e) {
            // Generic error to avoid account enumeration
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "If an account exists with that identifier, an OTP has been sent."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error sending OTP. Please try again."));
        }
    }

    /**
     * POST /api/auth/verify-reset-otp
     * Validates the password reset OTP before allowing the password change.
     */
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<Map<String, String>> validateResetOtp(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp) {

        Optional<User> userOptional = userService.verifyOtp(otp, email, TokenType.PASSWORD_RESET);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "OTP verified. Proceed to reset password."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP."));
        }
    }

    /**
     * POST /api/auth/reset-password
     * Finalizes the password reset.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> processResetPassword(
            @RequestBody Map<String, String> resetData) {

        String email = resetData.get("email");
        String newPassword = resetData.get("newPassword");
        String confirmPassword = resetData.get("confirmPassword");

        if (newPassword == null || !newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Passwords do not match."));
        }

        try {
            userService.resetPassword(email, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reset password."));
        }
    }



    /**
 * GET /api/auth/session
 * Returns current authenticated user info or 401 if not authenticated
 */
@GetMapping("/session")
public ResponseEntity<Map<String, Object>> getCurrentSession(
        @AuthenticationPrincipal UserDetails userDetails) {
    
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Map<String, Object> session = new HashMap<>();
    session.put("username", userDetails.getUsername());
    session.put("roles", userDetails.getAuthorities());
    
    // Get display name from Customer if exists
    Optional<Customer> customer = userService.getCustomerDetailsByUsername(
        userDetails.getUsername()
    );
    session.put("displayName", customer.map(Customer::getFirstName).orElse("User"));
    
    return ResponseEntity.ok(session);
}

/**
 * POST /api/auth/logout
 * Explicitly logs out the user
 */
@PostMapping("/logout")
public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
    request.getSession().invalidate();
    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
}


/**
 * POST /api/auth/login
 * Custom login endpoint that returns JSON instead of redirect
 */
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(
        @RequestParam String username,
        @RequestParam String password,
        HttpServletRequest request) {
    
    try {
        // Authenticate manually
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Create session
        HttpSession session = request.getSession(true);
        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            SecurityContextHolder.getContext()
        );
        
        // Return user info
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("roles", authentication.getAuthorities());
        
        return ResponseEntity.ok(response);
        
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid username or password"));
    } catch (DisabledException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", "Account not verified"));
    }
}

}