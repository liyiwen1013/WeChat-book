package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.BookComment;
import top.liyiwen.book.mapper.BookCommentMapper;
import top.liyiwen.book.service.BookCommentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 书籍评论表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Service
public class BookCommentServiceImpl extends ServiceImpl<BookCommentMapper, BookComment> implements BookCommentService {

}
