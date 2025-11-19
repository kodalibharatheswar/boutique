package com.boutique.product.controller.admin;

import com.boutique.product.entity.Product;
import com.boutique.product.entity.ProductCategory;
import com.boutique.product.service.ProductService;
import com.boutique.product.repository.ProductCategoryRepository;
import com.boutique.product.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/admin/products")
public class ProductAdminController {

    private final ProductService productService;
    private final ProductCategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    public ProductAdminController(ProductService productService,
                                  ProductCategoryRepository categoryRepo,
                                  ProductRepository productRepo) {
        this.productService = productService;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        return "admin/products/list";
    }

    @GetMapping("/create")
    public String createPage(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryRepo.findAll());
        return "admin/products/create";
    }

    // handle multipart
    @PostMapping("/create")
    public String save(@ModelAttribute Product product,
                       @RequestParam("images") MultipartFile[] images) {

        productService.saveProductWithImages(product, images);
        return "redirect:/admin/products";
    }

    @GetMapping("/edit/{id}")
    public String editPage(@PathVariable Long id, Model model) {
        Product p = productService.getProduct(id);
        model.addAttribute("product", p);
        model.addAttribute("categories", categoryRepo.findAll());
        return "admin/products/edit";
    }

    @PostMapping("/edit")
    public String update(@ModelAttribute Product product,
                         @RequestParam(value = "images", required = false) MultipartFile[] images) {
        productService.saveProductWithImages(product, images);
        return "redirect:/admin/products";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "redirect:/admin/products";
    }
}
