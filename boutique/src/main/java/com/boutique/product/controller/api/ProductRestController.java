package com.boutique.product.controller.api;

import com.boutique.product.dto.ProductDto;
import com.boutique.product.entity.Product;
import com.boutique.product.entity.ProductImage;
import com.boutique.product.mapper.ProductMapper;
import com.boutique.product.repository.ProductImageRepository;
import com.boutique.product.repository.ProductRepository;
import com.boutique.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {

    private final ProductService service;
    private final ProductRepository productRepo;
    private final ProductImageRepository imageRepo;

    public ProductRestController(ProductService service,
                                 ProductRepository productRepo,
                                 ProductImageRepository imageRepo) {
        this.service = service;
        this.productRepo = productRepo;
        this.imageRepo = imageRepo;
    }

    @GetMapping
    public List<ProductDto> getAll() {
        return service.getAllProducts()
                .stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductDto getOne(@PathVariable Long id) {
        return ProductMapper.toDto(service.getProduct(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ProductDto create(
            @ModelAttribute Product product,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) {
        return ProductMapper.toDto(service.saveProductWithImages(product, images));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ProductDto update(
            @PathVariable Long id,
            @ModelAttribute Product product,
            @RequestParam(value = "images", required = false) MultipartFile[] images
    ) {
        product.setId(id);
        return ProductMapper.toDto(service.saveProductWithImages(product, images));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    // ---------- DELETE SPECIFIC IMAGE ----------
    @DeleteMapping("/{productId}/image/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long productId,
                                         @PathVariable Long imageId) {

        ProductImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new NoSuchElementException("Image not found"));

        if (!img.getProduct().getId().equals(productId))
            return ResponseEntity.badRequest().body("Image does not belong to product");

        imageRepo.delete(img);

        return ResponseEntity.ok("Image deleted");
    }

    // ---------- SET MAIN IMAGE ----------
    @PostMapping("/{productId}/image/{imageId}/set-main")
    public ProductDto setMainImage(@PathVariable Long productId,
                                   @PathVariable Long imageId) {

        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        ProductImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new NoSuchElementException("Image not found"));

        if (!img.getProduct().getId().equals(productId))
            throw new IllegalArgumentException("Image does not belong to product");

        p.setMainImage(img.getFileName());
        productRepo.save(p);

        return ProductMapper.toDto(p);
    }
}
