package com.example.KanbanBoard.service;
import com.example.KanbanBoard.domain.PasswordResetToken;
import com.example.KanbanBoard.domain.User;
import com.example.KanbanBoard.exception.UserNotFoundException;
import com.example.KanbanBoard.repository.PasswordResetTokenRepository;
import com.example.KanbanBoard.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements IPasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetServiceImpl(PasswordResetTokenRepository tokenRepository,
                                    UserRepository userRepository,
                                    PasswordEncoder passwordEncoder,
                                    EmailService emailService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public String createPasswordResetToken(String email) throws UserNotFoundException
    {
        User user = userRepository.findByUserEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        // Remove existing token for user
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        // Create token
        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(System.currentTimeMillis() + 5 * 60 * 1000); // 5 minutes

        PasswordResetToken resetToken = new PasswordResetToken(null, token, user, expiryDate);
        tokenRepository.save(resetToken);


        emailService.sendPasswordResetEmail(email, token);

        return token;
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setUserPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove token after use
        tokenRepository.delete(resetToken);
    }
}
