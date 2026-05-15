package de.neighbourly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ProductDetailsDto {
    private String productName;
    private BigDecimal price;
}
