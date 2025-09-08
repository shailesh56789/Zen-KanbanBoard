package com.example.kanbanboard.passwordResetService.Service;
import com.example.kanbanboard.passwordResetService.Client.EmailServiceClient;
import com.example.kanbanboard.passwordResetService.Client.UserServiceClient;
import com.example.kanbanboard.passwordResetService.Entity.PasswordResetToken;
import com.example.kanbanboard.passwordResetService.Exception.InvalidInputException;
import com.example.kanbanboard.passwordResetService.Exception.UserNotFoundException;
import com.example.kanbanboard.passwordResetService.Repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements IPasswordResetService
{

    private final PasswordResetTokenRepository tokenRepository;
    private final UserServiceClient userServiceClient;
    private final EmailServiceClient emailServiceClient;

    public PasswordResetServiceImpl(PasswordResetTokenRepository tokenRepository, UserServiceClient userServiceClient, EmailServiceClient emailServiceClient) {
        this.tokenRepository = tokenRepository;
        this.userServiceClient = userServiceClient;
        this.emailServiceClient = emailServiceClient;
    }

    @Override
    public String createPasswordResetToken(String email) throws UserNotFoundException
    {
        // 1. Call UserService
        Map<String, Object> userData = userServiceClient.getUserByEmail(email);
        if (userData == null || !userData.containsKey("userId"))
        {
            throw new UserNotFoundException("User not found");
        }

        Long userId = Long.valueOf(userData.get("userId").toString());

        // 2. Delete old token if exists
        tokenRepository.findByUserId(userId).ifPresent(tokenRepository::delete);

        // 3. Create new token
        String token = UUID.randomUUID().toString();
        Date expiry = new Date(System.currentTimeMillis() + 5 * 60 * 1000); // 5 mins
        tokenRepository.save(new PasswordResetToken(null, token, userId, expiry));

        // 4. Call EmailService to send email
        Map<String, String> body = new HashMap<>();
        body.put("toEmail", email);
        body.put("token", token);
        emailServiceClient.sendPasswordResetEmail(body);

        return token;
    }

    @Override
    public void resetPassword(String token, String newPassword) throws InvalidInputException
    {
        if(token==null||newPassword==null||token.isEmpty()||newPassword.isEmpty())
        {
            throw new InvalidInputException("Token and Password cannot be Empty");
        }
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token expired");
        }

        // 1. Call UserService to reset password
        Map<String, String> body = new HashMap<>();
        body.put("userId", resetToken.getUserId().toString());
        body.put("newPassword", newPassword);
        userServiceClient.resetPassword(body);

        // 2. Delete token
        tokenRepository.delete(resetToken);
    }
}
