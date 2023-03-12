package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.Like;
import top.liyiwen.book.mapper.LikeMapper;
import top.liyiwen.book.service.LikeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 点赞表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Service
public class LikeServiceImpl extends ServiceImpl<LikeMapper, Like> implements LikeService {

}
