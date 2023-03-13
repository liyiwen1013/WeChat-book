package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.BookCategory;
import top.liyiwen.book.mapper.BookCategoryMapper;
import top.liyiwen.book.service.BookCategoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 书籍分类表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-13
 */
@Service
public class BookCategoryServiceImpl extends ServiceImpl<BookCategoryMapper, BookCategory> implements BookCategoryService {

}
