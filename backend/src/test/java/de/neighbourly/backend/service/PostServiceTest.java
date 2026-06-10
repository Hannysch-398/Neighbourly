package de.neighbourly.backend.service;

import de.neighbourly.backend.dto.PostDetailResponseDto;
import de.neighbourly.backend.dto.PostImageDto;
import de.neighbourly.backend.entity.Post;
import de.neighbourly.backend.entity.PostImage;
import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.model.PostMode;
import de.neighbourly.backend.model.PostStatus;
import de.neighbourly.backend.model.PostType;
import de.neighbourly.backend.repository.EventRepository;
import de.neighbourly.backend.repository.HousingDetailRepository;
import de.neighbourly.backend.repository.PostImageRepository;
import de.neighbourly.backend.repository.PostLocationRepository;
import de.neighbourly.backend.repository.PostRepository;
import de.neighbourly.backend.repository.PostTagRepository;
import de.neighbourly.backend.repository.ProductDetailRepository;
import de.neighbourly.backend.repository.SkillDetailRepository;
import de.neighbourly.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private SkillDetailRepository skillDetailRepository;

    @Mock
    private ProductDetailRepository productDetailRepository;

    @Mock
    private PostLocationRepository postLocationRepository;

    @Mock
    private PostTagRepository postTagRepository;

    @Mock
    private PostImageRepository postImageRepository;

    @Mock
    private PostImageStorageService postImageStorageService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private HousingDetailRepository housingDetailRepository;

    @Mock
    private GeoService geoService;

    @InjectMocks
    private PostService postService;

    @Test
    void getPostDetail_shouldReturnImagesOrderedByOrderIndexAscending() {
        Long postId = 1L;
        Post post = buildPost(postId);

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(productDetailRepository.findByPostId(postId)).thenReturn(Optional.empty());
        when(postLocationRepository.findByPostId(postId)).thenReturn(Optional.empty());
        when(postTagRepository.findAllByPostId(postId)).thenReturn(List.of());
        when(postImageRepository.findAllByPostIdOrderByOrderIndexAsc(postId)).thenReturn(List.of(
                buildImage(11L, post, 2),
                buildImage(12L, post, 0),
                buildImage(13L, post, 1)
        ));
        when(postImageStorageService.isStoredUploadAvailable("https://example.com/image-11.jpg")).thenReturn(true);
        when(postImageStorageService.isStoredUploadAvailable("https://example.com/image-12.jpg")).thenReturn(true);
        when(postImageStorageService.isStoredUploadAvailable("https://example.com/image-13.jpg")).thenReturn(true);

        PostDetailResponseDto response = postService.getPostDetail(postId, null);

        verify(postImageRepository).findAllByPostIdOrderByOrderIndexAsc(postId);
        assertThat(response.getImages())
                .extracting(PostImageDto::getId)
                .containsExactly(12L, 13L, 11L);
        assertThat(response.getImages())
                .extracting(PostImageDto::getOrderIndex)
                .containsExactly(0, 1, 2);
    }

    @Test
    void getPostDetail_shouldSkipMissingStoredUploadImages() {
        Long postId = 1L;
        Post post = buildPost(postId);
        PostImage missingImage = buildImage(11L, post, 0);
        missingImage.setUrl("/uploads/post-images/missing.png");
        PostImage availableImage = buildImage(12L, post, 1);
        availableImage.setUrl("/uploads/post-images/available.png");

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(productDetailRepository.findByPostId(postId)).thenReturn(Optional.empty());
        when(postLocationRepository.findByPostId(postId)).thenReturn(Optional.empty());
        when(postTagRepository.findAllByPostId(postId)).thenReturn(List.of());
        when(postImageRepository.findAllByPostIdOrderByOrderIndexAsc(postId)).thenReturn(List.of(
                missingImage,
                availableImage
        ));
        when(postImageStorageService.isStoredUploadAvailable("/uploads/post-images/missing.png")).thenReturn(false);
        when(postImageStorageService.isStoredUploadAvailable("/uploads/post-images/available.png")).thenReturn(true);

        PostDetailResponseDto response = postService.getPostDetail(postId, null);

        assertThat(response.getImages())
                .extracting(PostImageDto::getUrl)
                .containsExactly("/uploads/post-images/available.png");
    }

    private Post buildPost(Long id) {
        User user = new User();
        user.setId(42L);

        Post post = new Post();
        post.setId(id);
        post.setUser(user);
        post.setTitle("Sorted images");
        post.setDescription("Post detail image order test");
        post.setType(PostType.PRODUCT);
        post.setPostMode(PostMode.OFFER);
        post.setStatus(PostStatus.ACTIVE);
        post.setCreatedAt(LocalDateTime.now().minusDays(1));
        post.setUpdatedAt(LocalDateTime.now());

        return post;
    }

    private PostImage buildImage(Long id, Post post, Integer orderIndex) {
        PostImage image = new PostImage();
        image.setId(id);
        image.setPost(post);
        image.setUrl("https://example.com/image-" + id + ".jpg");
        image.setAltText("Image " + id);
        image.setOrderIndex(orderIndex);
        image.setCreatedAt(LocalDateTime.now());

        return image;
    }
}
