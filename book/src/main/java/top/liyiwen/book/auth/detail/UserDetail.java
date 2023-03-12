package top.liyiwen.book.auth.detail;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import top.liyiwen.book.enums.PasswordEncoderTypeEnum;

import java.util.Collection;
import java.util.Set;

@Data
public class UserDetail implements UserDetails {

    /**
     * 扩展字段：用户ID
     */
    private Integer id;

    /**
     * 默认字段
     */
    private String username;
    private String password;
    private Set<SimpleGrantedAuthority> authorities;

    public UserDetail(Integer id, String username, String password, Set<SimpleGrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = PasswordEncoderTypeEnum.BCRYPT + password;
        this.authorities = authorities;
    }

    public UserDetail(Integer id, Set<SimpleGrantedAuthority> authorities) {
        this.id = id;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}