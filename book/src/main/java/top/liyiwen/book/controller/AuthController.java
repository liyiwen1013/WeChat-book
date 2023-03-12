package top.liyiwen.book.controller;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.liyiwen.book.auth.detail.UserDetail;
import top.liyiwen.book.auth.extension.WxAuthenticationToken;
import top.liyiwen.book.model.User;
import top.liyiwen.book.service.UserService;
import top.liyiwen.book.utils.JwtUtil;

import java.time.LocalDateTime;
import java.util.Objects;

@RequestMapping
@RestController
public class AuthController {

    @Autowired
    private WxMaService wxService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public String loginByWx(@RequestBody String code1) {

        // 获取code
        String code = code1;

        // 发送 code + appid + appsecret 认证登陆
        // 返回 session_key + openid
        String sessionKey = null;
        String openid = null;
        try {
            WxMaJscode2SessionResult result = wxService.getUserService().getSessionInfo(code);
            sessionKey = result.getSessionKey();
            openid = result.getOpenid();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 根据openid查询数据库中是否存在该用户
        LambdaQueryWrapper<User> userLambdaQueryWrapper = Wrappers.lambdaQuery(User.class)
                .eq(User::getOpenid, openid);
        int count = userService.count(userLambdaQueryWrapper);
        if (count <= 0) {
            User user = new User();
            user.setUsername("TODO");
            user.setPassword("");
            user.setMobile("");
            user.setLastLoginIp("TODO");
            user.setLastLoginTime(LocalDateTime.now());
            user.setOpenid(openid);
            user.setSessionKey(sessionKey);
            user.setAvatar("TODO");
            user.setNickname("TODO");
            boolean res = userService.save(user);
            if (!res) {
                throw new RuntimeException("登录失败");
            }
        }

        WxAuthenticationToken authenticationToken = new WxAuthenticationToken(openid);
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        if (Objects.isNull(authenticate)) {

        }
        UserDetail userDetail = (UserDetail) authenticate.getPrincipal();

        String jwt = JwtUtil.generateJWT(userDetail.getId(), false);

        // 返回
        return jwt;
    }

}