package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.Book;
import top.liyiwen.book.mapper.BookMapper;
import top.liyiwen.book.service.BookService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 书籍表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-13
 */
@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

}
