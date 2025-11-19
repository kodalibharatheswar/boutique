package com.boutique.product.controller;

import com.boutique.product.entity.Product;
import com.boutique.product.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("products", service.getAllProducts());
        return "product/list";
    }

    @GetMapping("/{id}")
    public String details(@PathVariable Long id, Model model) {
        Product p = service.getProduct(id);
        model.addAttribute("product", p);
        return "product/details";
    }
}
