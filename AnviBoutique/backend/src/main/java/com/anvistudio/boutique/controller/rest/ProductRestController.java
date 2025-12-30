package com.anvistudio.boutique.controller.rest;

import com.anvistudio.boutique.model.Product;
import com.anvistudio.boutique.model.Review;
import com.anvistudio.boutique.service.ProductService;
import com.anvistudio.boutique.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST Controller for Product Catalog and Reviews.
 * Replaces the Thymeleaf-based ProductController.
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductRestController {

    private final ProductService productService;
    private final ReviewService reviewService;

    public ProductRestController(ProductService productService, ReviewService reviewService) {
        this.productService = productService;
        this.reviewService = reviewService;
    }

    /**
     * GET /api/products
     * Returns a list of products, optionally filtered by category.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listProducts(
            @RequestParam(value = "category", required = false) String category) {

        List<Product> products = productService.getProductsByCategoryOrAll(category);

        Map<String, Object> response = new HashMap<>();
        response.put("products", products);
        response.put("selectedCategory", category != null ? category : "All");
        response.put("categories", getAllCategories());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/products/{id}
     * Returns detailed information about a product, its reviews, and related products.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable Long id) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        List<Product> relatedProducts = productService.getRelatedProducts(product.getCategory(), id);
        List<Review> approvedReviews = reviewService.getApprovedReviewsForProduct(id);

        Map<String, Object> response = new HashMap<>();
        response.put("product", product);
        response.put("relatedProducts", relatedProducts.subList(0, Math.min(relatedProducts.size(), 4)));
        response.put("reviews", approvedReviews);
        response.put("categories", getAllCategories());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
    List<Product> results = productService.getFilteredProducts(
        null, null, null, null, null, null, keyword
    );
    return ResponseEntity.ok(results);
}


    /**
     * POST /api/products/{id}/review
     * Handles the submission of a new product review via JSON.
     */
    @PostMapping("/{id}/review")
    public ResponseEntity<Map<String, String>> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long productId,
            @RequestBody Map<String, Object> reviewData) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "You must be logged in to submit a review."));
        }

        try {
            int rating = Integer.parseInt(reviewData.get("rating").toString());
            String comment = (String) reviewData.get("comment");

            reviewService.submitReview(userDetails.getUsername(), productId, rating, comment);

            return ResponseEntity.ok(Map.of(
                    "message", "Review submitted! It will appear once approved by our team."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit review. Please try again."));
        }
    }

    /**
     * Helper to retrieve all available categories for the frontend.
     */
    @GetMapping("/categories")
    public ResponseEntity<String[]> getCategories() {
        return ResponseEntity.ok(getAllCategories());
    }

    private String[] getAllCategories() {
        return new String[]{
                "Sarees", "Lehengas", "Kurtis", "Long Frocks", "Mom & Me", "Crop Top – Skirts",
                "Handlooms", "Casual Frocks", "Ready To Wear", "Dupattas", "Kids wear",
                "Dress Material", "Blouses", "Fabrics"
        };
    }
}