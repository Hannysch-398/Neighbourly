package de.neighbourly.backend.mapper;

import de.neighbourly.backend.entity.Post;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PostMapperTest {

    @Test
    void shouldReturnTrueWhenUrgentAndNotExpired() {
        Post post = new Post();
        post.setUrgent(true);
        post.setUrgentUntil(LocalDateTime.now().plusDays(1));

        assertTrue(PostMapper.isEffectivelyUrgent(post));
    }

    @Test
    void shouldReturnFalseWhenUrgentButExpired() {
        Post post = new Post();
        post.setUrgent(true);
        post.setUrgentUntil(LocalDateTime.now().minusDays(1));

        assertFalse(PostMapper.isEffectivelyUrgent(post));
    }

    @Test
    void shouldReturnFalseWhenNotUrgent() {
        Post post = new Post();
        post.setUrgent(false);

        assertFalse(PostMapper.isEffectivelyUrgent(post));
    }


    @Test
    void shouldReturnTrueWhenUrgentAndNoExpirationDate() {
        Post post = new Post();
        post.setUrgent(true);
        post.setUrgentUntil(null);

        assertTrue(PostMapper.isEffectivelyUrgent(post));
    }
}