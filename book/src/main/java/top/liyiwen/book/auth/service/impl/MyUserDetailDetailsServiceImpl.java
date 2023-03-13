package top.liyiwen.book.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import top.liyiwen.book.auth.detail.UserDetail;
import top.liyiwen.book.auth.service.MyUserDetailsService;
import top.liyiwen.book.mapper.UserMapper;
import top.liyiwen.book.model.User;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service("userDetailsService")
@Slf4j
public class MyUserDetailDetailsServiceImpl implements MyUserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 查询用户
        LambdaQueryWrapper<User> userLambdaQueryWrapper = Wrappers.lambdaQuery(User.class)
                .select(
                        User::getId,
                        User::getUsername,
                        User::getPassword)
                .eq(User::getUsername, username);
        User user = userMapper.selectOne(userLambdaQueryWrapper);
        if (Objects.isNull(user)) {
            // 没查到用户抛出异常
            throw new UsernameNotFoundException("用户不存在");
        }

        // 获取用户权限
        Set<SimpleGrantedAuthority> grantedAuthorities = this.getGrantedAuthority(user.getId());

        // 将数据封装成UserDetails返回
        return new UserDetail(user.getId(), user.getUsername(), user.getPassword(), grantedAuthorities);
    }

    @Override
    public UserDetails loadUserByOpenId(String openid) {
        // 查询用户
        LambdaQueryWrapper<User> userLambdaQueryWrapper = Wrappers.lambdaQuery(User.class)
                .select(
                        User::getId,
                        User::getUsername)
                .eq(User::getOpenid, openid);
        User user = userMapper.selectOne(userLambdaQueryWrapper);
        if (Objects.isNull(user)) {
            // 没查到用户抛出异常
            throw new UsernameNotFoundException("用户不存在");
        }

        // 获取用户权限
        Set<SimpleGrantedAuthority> grantedAuthorities = this.getGrantedAuthority(user.getId());

        return new UserDetail(user.getId(), user.getUsername(), grantedAuthorities);
    }

    /**
     * 获取用户权限（目前默认不分配与校验权限）
     */
    private Set<SimpleGrantedAuthority> getGrantedAuthority(int userId) {
        return new HashSet<>();
    }
}