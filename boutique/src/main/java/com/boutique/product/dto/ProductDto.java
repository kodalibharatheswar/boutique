package com.boutique.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String categoryName;

    private String mainImage; // main displayed image

    private List<String> images; // list of filenames
}
