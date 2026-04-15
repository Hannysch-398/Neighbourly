package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.User;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByVerificationToken(String token);

    Optional<User> findByEmail(String email);
}