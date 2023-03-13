package top.liyiwen.book.service;

import top.liyiwen.book.form.login.UserLoginForm;
import top.liyiwen.book.model.User;
import com.baomidou.mybatisplus.extension.service.IService;
import top.liyiwen.book.response.Response;

import javax.servlet.http.HttpServletRequest;

/**
 * <p>
 * 用户表 服务类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
public interface UserService extends IService<User> {

    Response login(HttpServletRequest request, UserLoginForm loginForm);

}
