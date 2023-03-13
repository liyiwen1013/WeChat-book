package top.liyiwen.book.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.liyiwen.book.form.login.UserLoginForm;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@Slf4j
@Validated
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Response loginByWx(HttpServletRequest request, @Valid @RequestBody UserLoginForm loginForm) {
        return userService.login(request, loginForm);
    }

}