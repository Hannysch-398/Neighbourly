package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    Optional<ProductDetail> findByPostId(Long postId);
}
