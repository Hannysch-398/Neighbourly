package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.HousingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HousingDetailRepository extends JpaRepository<HousingDetail, Long> {

    Optional<HousingDetail> findByPostId(Long postId);
}