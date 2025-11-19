package com.boutique.admin;

import com.boutique.product.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminDashboardController {

    private final ProductRepository productRepository;

    public AdminDashboardController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard(Model model) {
        model.addAttribute("productCount", productRepository.count());
        return "admin/dashboard";
    }
}