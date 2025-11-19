package com.boutique.customer.controller;

import com.boutique.customer.entity.Customer;
import com.boutique.customer.repository.CustomerRepository;
import com.boutique.product.service.ProductService;
import com.boutique.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomerDashboardController {

    private final ProductService productService;
    private final CustomerRepository customerRepository;

    public CustomerDashboardController(ProductService productService,
                                       CustomerRepository customerRepository) {
        this.productService = productService;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/customer/dashboard")
    public String dashboard(@AuthenticationPrincipal CustomUserDetails userDetails,
                            Model model) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        model.addAttribute("customer", customer);
        model.addAttribute("products", productService.getAllProducts());

        return "customer/dashboard";
    }
}