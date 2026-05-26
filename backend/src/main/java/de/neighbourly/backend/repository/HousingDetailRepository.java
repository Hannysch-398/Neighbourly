package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.HousingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HousingDetailRepository extends JpaRepository<HousingDetail, Long> {
}
