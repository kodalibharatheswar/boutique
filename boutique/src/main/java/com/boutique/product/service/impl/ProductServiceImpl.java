package com.boutique.product.service.impl;

import com.boutique.product.entity.Product;
import com.boutique.product.entity.ProductImage;
import com.boutique.product.repository.ProductImageRepository;
import com.boutique.product.repository.ProductRepository;
import com.boutique.product.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository imageRepository;

    // configured path from application.properties
    private final Path uploadDir;

    public ProductServiceImpl(ProductRepository productRepository,
                              ProductImageRepository imageRepository,
                              @Value("${app.upload.dir}") String uploadDir) {
        this.productRepository = productRepository;
        this.imageRepository = imageRepository;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + this.uploadDir, e);
        }
    }

    @Override
    public Product saveProduct(Product product) {
        // if product has images set with their product reference, cascade is configured
        return productRepository.save(product);
    }

    @Override
    public Product saveProductWithImages(Product product, MultipartFile[] images) {
        Product saved = productRepository.save(product);

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                if (file == null || file.isEmpty()) continue;

                // generate safe filename
                String ext = "";
                String original = file.getOriginalFilename();
                if (original != null && original.contains(".")) {
                    ext = original.substring(original.lastIndexOf('.'));
                }
                String filename = UUID.randomUUID().toString() + ext;

                try {
                    Path target = uploadDir.resolve(filename);
                    // write file
                    Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                    // persist image record
                    ProductImage pi = new ProductImage();
                    pi.setFileName(filename);
                    pi.setProduct(saved);
                    imageRepository.save(pi);

                    // set mainImage if null
                    if (saved.getMainImage() == null) {
                        saved.setMainImage(filename);
                        saved = productRepository.save(saved);
                    }

                } catch (IOException e) {
                    throw new RuntimeException("Failed to store file " + filename, e);
                }
            }
        }

        // reload product with images
        return productRepository.findById(saved.getId()).orElse(saved);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteProduct(Long id) {
        // delete images files from disk first
        Product p = productRepository.findById(id).orElse(null);
        if (p != null) {
            List<ProductImage> imgs = p.getImages();
            if (imgs != null) {
                List<String> fileNames = imgs.stream().map(ProductImage::getFileName).collect(Collectors.toList());
                for (String fn : fileNames) {
                    try {
                        Files.deleteIfExists(uploadDir.resolve(fn));
                    } catch (IOException ignored) {}
                }
            }
        }
        productRepository.deleteById(id);
    }
}
