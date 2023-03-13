package top.liyiwen.book.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import top.liyiwen.book.auth.detail.UserDetail;
import top.liyiwen.book.auth.extension.WxAuthenticationToken;
import top.liyiwen.book.exception.BookException;
import top.liyiwen.book.form.login.UserLoginForm;
import top.liyiwen.book.mapper.UserMapper;
import top.liyiwen.book.model.User;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.response.ResponseCode;
import top.liyiwen.book.service.UserService;
import top.liyiwen.book.utils.IpUtil;
import top.liyiwen.book.utils.JwtUtil;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private WxMaService wxService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Response login(HttpServletRequest request, UserLoginForm loginForm) {
        // 构建参数
        String code = loginForm.getCode();
        String nickname = loginForm.getNickname();
        String avatar = loginForm.getAvatar();

        // 发送 code + appid + appsecret 认证登陆，返回 session_key + openid
        WxMaJscode2SessionResult result;
        String sessionKey;
        String openid;
        try {
            result = wxService.getUserService().getSessionInfo(code);
            sessionKey = result.getSessionKey();
            openid = result.getOpenid();
        } catch (Exception e) {
            log.error("请求微信服务器获取openid失败，code={}", code);
            throw new BookException(ResponseCode.USER_LOGIN_ERROR, "登录失败");
        }
        if (Objects.isNull(openid)) {
            log.warn("code无效，获取openid失败，code={}，result={}", code, result);
            throw new BookException(ResponseCode.USER_LOGIN_ERROR, "登录失败");
        }

        // 根据openid查询数据库中是否存在该用户
        LambdaQueryWrapper<User> userLambdaQueryWrapper = Wrappers.lambdaQuery(User.class)
                .select(
                        User::getId,
                        User::getUpdateTime)
                .eq(User::getOpenid, openid);
        User user = this.getOne(userLambdaQueryWrapper);
        if (Objects.isNull(user)) {
            user = new User();
            user.setUsername("");
            user.setPassword("");
            user.setMobile("");
            user.setLastLoginIp(IpUtil.getIpAddr(request));
            user.setLastLoginTime(LocalDateTime.now());
            user.setOpenid(openid);
            user.setSessionKey(sessionKey);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            boolean res = this.save(user);
            if (!res) {
                throw new BookException(ResponseCode.USER_LOGIN_ERROR, "登录失败");
            }
        } else {
            user.setLastLoginTime(LocalDateTime.now());
            user.setLastLoginIp(IpUtil.getIpAddr(request));
            user.setSessionKey(sessionKey);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            boolean res = this.updateById(user);
            if (!res) {
                throw new BookException(ResponseCode.USER_LOGIN_ERROR, "登录失败");
            }
        }

        WxAuthenticationToken authenticationToken = new WxAuthenticationToken(openid);
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        if (Objects.isNull(authenticate)) {
            throw new BookException(ResponseCode.USER_LOGIN_ERROR, "登录失败");
        }
        UserDetail userDetail = (UserDetail) authenticate.getPrincipal();

        // 生成token
        String token = JwtUtil.generateJwt(userDetail.getId(), false);

        // 返回
        return Response.success(token);
    }
}
