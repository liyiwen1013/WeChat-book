package top.liyiwen.book.constants;

public interface SecurityConstant {

    /**
     * JWT 加密私钥密钥
     */
    String JWT_SECRET_KEY = "f63QPcMN6ct5GG571u7MVRcf5aefeAhfO3RaTcrvjEeXGzXyla9fd1oYIxJ7kzyB";

    /**
     * JWT令牌前缀
     */
    String TOKEN_PREFIX = "Bearer ";

    /**
     * 认证请求头key
     */
    String TOKEN_HEADER = "Authorization";

    /**
     * Basic认证前缀
     */
    String BASIC_PREFIX = "Basic ";

    /**
     * Token 类型
     */
    String TOKEN_TYPE = "JWT";

    /**
     * JWT 主体
     */
    String TOKEN_SUB = "This is book back token";

    /**
     * 签发主体
     */
    String TOKEN_ISSUER = "LiYiWen";

    /**
     * 接受对象
     */
    String TOKEN_AUDIENCE = "MINIAPP";

    /**
     * 当 Remember 是 false 时，token 有效时间 2 小时
     */
    long EXPIRATION_TIME = 1000 * 60 * 60 * 2L;

    /**
     * 当 Remember 是 true 时，token 有效时间 7 天
     */
    long EXPIRATION_REMEMBER_TIME = 1000 * 60 * 60 * 24 * 7L;


}
