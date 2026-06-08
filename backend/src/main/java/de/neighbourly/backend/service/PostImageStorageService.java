package de.neighbourly.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class PostImageStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/gif", ".gif",
            "image/webp", ".webp"
    );

    private final Path postImagesDirectory;

    public PostImageStorageService(
            @Value("${neighbourly.upload.post-images-dir:uploads/post-images}") String postImagesDirectory
    ) {
        this.postImagesDirectory = Path.of(postImagesDirectory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Only JPEG, PNG, GIF and WebP images are supported");
        }

        try {
            Files.createDirectories(postImagesDirectory);
            String filename = UUID.randomUUID() + resolveExtension(file, contentType);
            Path target = postImagesDirectory.resolve(filename).normalize();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/post-images/" + filename;
        } catch (IOException ex) {
            throw new IllegalStateException("Image could not be stored", ex);
        }
    }

    private String resolveExtension(MultipartFile file, String contentType) {
        String originalFilename = file.getOriginalFilename();

        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
                String extension = originalFilename.substring(dotIndex).toLowerCase(Locale.ROOT);

                if (EXTENSIONS_BY_CONTENT_TYPE.containsValue(extension)) {
                    return extension;
                }
            }
        }

        return EXTENSIONS_BY_CONTENT_TYPE.get(contentType.toLowerCase(Locale.ROOT));
    }
}
