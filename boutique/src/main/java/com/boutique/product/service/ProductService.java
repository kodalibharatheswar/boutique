package com.boutique.product.service;

import com.boutique.product.entity.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    Product saveProduct(Product product);

    /**
     * Create or update product and save uploaded images
     * @param product product entity (id null for create)
     * @param images uploaded files (may be empty)
     * @return saved product
     */
    Product saveProductWithImages(Product product, MultipartFile[] images);

    List<Product> getAllProducts();

    Product getProduct(Long id);

    void deleteProduct(Long id);
}
