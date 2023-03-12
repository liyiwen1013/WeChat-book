package top.liyiwen.book.auth.extension;

import lombok.Data;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import top.liyiwen.book.auth.exception.WxOpenidNotFoundException;
import top.liyiwen.book.auth.service.MyUserDetailsService;

import java.util.Objects;

@Data
public class WxAuthenticationProvider implements AuthenticationProvider {

    private UserDetailsService userDetailsService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        WxAuthenticationToken authenticationToken = (WxAuthenticationToken) authentication;
        String openid = (String) authenticationToken.getPrincipal();

        // 根据openid读取用户
        UserDetails userDetails = ((MyUserDetailsService) userDetailsService).loadUserByOpenId(openid);
        if (Objects.isNull(userDetails)) {
            throw new WxOpenidNotFoundException("微信登录异常");
        }

        WxAuthenticationToken authenticationResult = new WxAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authenticationResult.setDetails(authentication.getDetails());
        return authenticationResult;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return WxAuthenticationToken.class.isAssignableFrom(authentication);
    }
}