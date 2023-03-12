package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.User;
import top.liyiwen.book.mapper.UserMapper;
import top.liyiwen.book.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
