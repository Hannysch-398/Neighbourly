package de.neighbourly.backend;

import de.neighbourly.backend.entity.TestTable;
import de.neighbourly.backend.repository.TestTableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TestTableValidationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TestTableValidationRunner.class);
    private final TestTableRepository testTableRepository;

    public TestTableValidationRunner(TestTableRepository testTableRepository) {
        this.testTableRepository = testTableRepository;
    }

    @Override
    public void run(String... args) {
        List<TestTable> entries = testTableRepository.findAll();

        log.info("TestTable validation started. Found {} entries.", entries.size());

        for (TestTable entry : entries) {
            log.info("Entry -> id: {}, name: '{}'", entry.getId(), entry.getName());
        }

        log.info("TestTable validation finished successfully.");
    }
}
