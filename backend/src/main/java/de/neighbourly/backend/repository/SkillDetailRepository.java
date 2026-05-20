package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.SkillDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillDetailRepository extends JpaRepository<SkillDetail, Long> {
    Optional<SkillDetail> findByPostId(Long PostId);
}
