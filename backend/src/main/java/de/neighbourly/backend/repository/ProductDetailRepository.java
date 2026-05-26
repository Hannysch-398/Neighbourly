package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDetailRepository extends JpaRepository<ProductDetail,Long> {
}
