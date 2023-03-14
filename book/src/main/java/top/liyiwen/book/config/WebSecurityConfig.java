package top.liyiwen.book.config;

import cn.binarywang.wx.miniapp.api.WxMaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import top.liyiwen.book.auth.extension.WxAuthenticationProvider;
import top.liyiwen.book.auth.service.MyUserDetailsService;
import top.liyiwen.book.filter.JwtAuthenticationTokenFilter;

/**
 * 安全配置
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private WxMaService wxService;
    @Autowired
    private MyUserDetailsService userDetailsService;

    /**
     * token认证过滤器
     */
    @Autowired
    private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    /**
     * 使用 Spring Security 推荐的加密方式进行登录密码的加密
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理对象
     */
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /**
     * 定义安全策略，设置 HTTP 访问规则
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // 添加JWT过滤器
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class)
                // 配置授权地址，除了登录接口，其他接口需要进行认证后才能访问
                .authorizeRequests()
                .antMatchers("/auth/login").anonymous()
                .antMatchers("/book/hot_list", "/book/hot_keyword", "/book/search", "/book/favor/count", "/book/*/short_comment", "/book/*/favor", "/book/*/detail", "/book/*/favor", "/classic/**").permitAll()
                .anyRequest().authenticated()
                .and()
                // 禁用 CSRF
                .csrf().disable()
                // 不需要 session（不创建会话）
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) {
        auth
                .authenticationProvider(wxAuthenticationProvider())
                .authenticationProvider(daoAuthenticationProvider());
    }

    /**
     * 微信code认证授权提供者
     */
    @Bean
    public WxAuthenticationProvider wxAuthenticationProvider() {
        WxAuthenticationProvider provider = new WxAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    /**
     * 用户名密码认证授权提供者
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        provider.setHideUserNotFoundExceptions(false); // 是否隐藏用户不存在异常，默认:true-隐藏；false-抛出异常；
        return provider;
    }

    /**
     * 此方法配置的资源路径不会进入 Spring Security 机制进行验证
     */
    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers(HttpMethod.OPTIONS, "/**")
                .antMatchers("/i18n/**")
                .antMatchers("/webjars/springfox-swagger-ui/**")
                .antMatchers("/swagger-resources/**")
                .antMatchers("/swagger-ui.html");
    }
}