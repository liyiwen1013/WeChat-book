package top.liyiwen.book.controller;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping
@RestController
public class AuthController {

    @Autowired
    private WxMaService wxService;

    @PostMapping("/login")
    public String loginByWx(@RequestBody String code) {
        // 发送 code + appid + appsecret 认证登陆
        // 返回 session_key + openid
        String sessionKey = null;
        String openId = null;
        try {
            WxMaJscode2SessionResult result = wxService.getUserService().getSessionInfo(code);
            sessionKey = result.getSessionKey();
            openId = result.getOpenid();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "sessionKey=" + sessionKey + ", openId=" + openId;
    }

}