package de.neighbourly.backend.repository;

import de.neighbourly.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findDistinctByParticipantsUserIdOrderByUpdatedAtDesc(Long userId);

    @Query("""
            SELECT c
            FROM Conversation c
            JOIN c.participants p1
            JOIN c.participants p2
            WHERE p1.user.id = :currentUserId
              AND p2.user.id = :participantUserId
              AND c.post.id = :postId
              AND SIZE(c.participants) = 2
            """)
    Optional<Conversation> findDirectConversationForPost(
            @Param("currentUserId") Long currentUserId,
            @Param("participantUserId") Long participantUserId,
            @Param("postId") Long postId
    );
}