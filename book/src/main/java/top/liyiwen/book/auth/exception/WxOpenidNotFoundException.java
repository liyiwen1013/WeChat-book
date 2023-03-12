package top.liyiwen.book.auth.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * 微信登录异常
 */
public class WxOpenidNotFoundException extends AuthenticationException {

    public WxOpenidNotFoundException(String msg, Throwable t) {
        super(msg, t);
    }

    public WxOpenidNotFoundException(String msg) {
        super(msg);
    }

}
