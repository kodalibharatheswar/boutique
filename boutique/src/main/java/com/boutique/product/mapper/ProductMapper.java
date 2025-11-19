package com.boutique.product.mapper;

import com.boutique.product.dto.ProductDto;
import com.boutique.product.entity.Product;

import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductDto toDto(Product p) {
        if (p == null) return null;

        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : null);
        dto.setMainImage(p.getMainImage());

        dto.setImages(
                p.getImages() == null
                        ? null
                        : p.getImages().stream()
                        .map(img -> img.getFileName())
                        .collect(Collectors.toList())
        );

        return dto;
    }
}
