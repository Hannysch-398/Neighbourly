package de.neighbourly.backend.security;

import de.neighbourly.backend.entity.User;
import de.neighbourly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User nicht gefunden: " + email));
        if ("DELETED".equals(user.getStatus()) || "DISABLED".equals(user.getStatus())) {
            throw new UsernameNotFoundException("User deaktiviert oder gelöscht");
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .disabled(!user.isEmailVerified())
                .authorities(new String[]{})
                .build();
    }
}