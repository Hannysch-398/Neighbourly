package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.TestTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestTableRepository extends JpaRepository<TestTable, Long> {
}
