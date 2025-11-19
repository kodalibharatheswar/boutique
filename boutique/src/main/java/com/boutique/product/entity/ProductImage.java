package com.boutique.product.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // store filename (not the full URL). Thymeleaf will render /images/products/{filename}
    @Column(name = "file_name")
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
