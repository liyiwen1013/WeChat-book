package top.liyiwen.book.filter;

import com.sun.istack.internal.NotNull;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import top.liyiwen.book.constants.SecurityConstant;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JwtAuthorizationFilter 用户请求授权过滤器
 *
 * <p>
 * 提供请求授权功能。用于处理所有 HTTP 请求，并检查是否存在带有正确 token 的 Authorization 标头。
 * 如果 token 有效，则过滤器会将身份验证数据添加到 Spring 的安全上下文中，并授权此次请求访问资源。
 * </p>
 */
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        // 从 HTTP 请求中获取 token
        String token = this.getTokenFromHttpRequest(request);
        // 验证 token 是否有效
//        if (StringUtils.hasText(token) && JwtUtil.validateToken(token)) {
//            // 获取认证信息
//            Authentication authentication = JwtUtil.getAuthentication(token);
//            // 将认证信息存入 Spring 安全上下文中
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//        }
        // 放行请求
        filterChain.doFilter(request, response);
    }

    /**
     * 从 HTTP 请求中获取 token
     *
     * @param request HTTP 请求
     * @return 返回 token
     */
    private String getTokenFromHttpRequest(HttpServletRequest request) {
        String authorization = request.getHeader(SecurityConstant.TOKEN_HEADER);
        if (authorization == null || !authorization.startsWith(SecurityConstant.TOKEN_PREFIX)) {
            return null;
        }
        // 去掉 token 前缀
        return authorization.replace(SecurityConstant.TOKEN_PREFIX, Strings.EMPTY);
    }

}