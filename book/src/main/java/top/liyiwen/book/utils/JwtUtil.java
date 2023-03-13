package top.liyiwen.book.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import top.liyiwen.book.constants.SecurityConstant;

import javax.xml.bind.DatatypeConverter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * JWT工具类，用于 生成、解析与验证 token
 **/
@Slf4j
public class JwtUtil {

    /**
     * 密钥
     */
    private static final byte[] secretKey = DatatypeConverter.parseBase64Binary(SecurityConstant.JWT_SECRET_KEY);

    /**
     * 根据用户名和用户角色生成 token
     *
     * @param userId     用户ID
     * @param isRemember 是否记住我
     * @return 返回生成的 token
     */
    public static String generateJwt(int userId, boolean isRemember) {
        byte[] jwtSecretKey = DatatypeConverter.parseBase64Binary(SecurityConstant.JWT_SECRET_KEY);
        // 当前时间
        long now = System.currentTimeMillis();
        // 过期时间
        long expirationTime = isRemember ? SecurityConstant.EXPIRATION_REMEMBER_TIME : SecurityConstant.EXPIRATION_TIME;
        // 设置载荷 payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", userId);
        // 生成 token
        return Jwts.builder()
                .setHeaderParam("typ", SecurityConstant.TOKEN_TYPE)
                .signWith(Keys.hmacShaKeyFor(jwtSecretKey), SignatureAlgorithm.HS256)
                .setId(UUID.randomUUID().toString())
                .setSubject(SecurityConstant.TOKEN_SUB)
                .setIssuer(SecurityConstant.TOKEN_ISSUER)
                .setAudience(SecurityConstant.TOKEN_AUDIENCE)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationTime))
                .addClaims(payload)
                .compact();
    }

    /**
     * 解析JWT
     */
    public static Claims parseJwt(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
}