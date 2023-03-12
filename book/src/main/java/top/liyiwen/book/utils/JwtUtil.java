package top.liyiwen.book.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import top.liyiwen.book.constants.SecurityConstant;

import javax.xml.bind.DatatypeConverter;
import java.util.Date;

/**
 * JWT工具类，用于 生成、解析与验证 token
 **/
@Slf4j
public final class JwtUtil {

    private static final byte[] secretKey = DatatypeConverter.parseBase64Binary(SecurityConstant.JWT_SECRET_KEY);

    /**
     * 根据用户名和用户角色生成 token
     *
     * @param userId     用户ID
     * @param isRemember 是否记住我
     * @return 返回生成的 token
     */
    public static String generateJWT(int userId, boolean isRemember) {
        byte[] jwtSecretKey = DatatypeConverter.parseBase64Binary(SecurityConstant.JWT_SECRET_KEY);
        // 当前时间
        long now = System.currentTimeMillis();
        // 过期时间
        long expirationTime = isRemember ? SecurityConstant.EXPIRATION_REMEMBER_TIME : SecurityConstant.EXPIRATION_TIME;
        // 生成 token
        return Jwts.builder()
                .setHeaderParam("typ", SecurityConstant.TOKEN_TYPE)
                .signWith(Keys.hmacShaKeyFor(jwtSecretKey), SignatureAlgorithm.HS256)
                .setId(String.valueOf(userId))
                .setSubject(SecurityConstant.TOKEN_SUB)
                .setIssuer(SecurityConstant.TOKEN_ISSUER)
                .setAudience(SecurityConstant.TOKEN_AUDIENCE)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationTime))
                .compact();
    }

    /**
     * 验证 token 是否有效
     *
     * <p>
     * 如果解析失败，说明 token 是无效的
     *
     * @param token token 信息
     * @return 如果返回 true，说明 token 有效
     */
    public static boolean validateToken(String token) {
        try {
            parseJWT(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Request to parse expired JWT : {} failed : {}", token, e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("Request to parse unsupported JWT : {} failed : {}", token, e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Request to parse invalid JWT : {} failed : {}", token, e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Request to parse empty or null JWT : {} failed : {}", token, e.getMessage());
        }
        return false;
    }

    /**
     * 解析JWT
     */
    private static Claims parseJWT(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
}