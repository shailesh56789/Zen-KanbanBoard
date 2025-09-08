package com.example.KanbanBoard.filter;
import com.example.KanbanBoard.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Component
public class JWTFilter extends OncePerRequestFilter
{

    private final JwtConfig jwtConfig;
    private static final List<String> EXCLUDED_PATHS = List.of("/login", "/register", "/password/forgot", "/password/reset");

    public JWTFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return EXCLUDED_PATHS.contains(path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);

            try {
                byte[] decodedKey = Base64.getDecoder().decode(jwtConfig.getSecret());

                Claims claims = Jwts.parser()
                        .setSigningKey(decodedKey)
                        .requireIssuer(jwtConfig.getIssuer())
                        .requireAudience(jwtConfig.getAudience())
                        .build()
                        .parseClaimsJws(jwtToken)
                        .getBody();

                Long userId = claims.get("userId", Long.class);
                String role = claims.get("role", String.class);
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority ("ROLE_"+role);


                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        Collections.singletonList(authority)
                );


                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

            } catch (Exception e) {
                // Token is invalid → respond with 401 and STOP filter chain
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or expired token\"}");
                return;
            }
        } else if (!shouldNotFilter(request)) {
            // No token provided and it's not an excluded path → reject
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token required\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}