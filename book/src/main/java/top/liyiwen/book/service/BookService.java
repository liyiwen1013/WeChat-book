package top.liyiwen.book.service;

import com.baomidou.mybatisplus.extension.service.IService;
import top.liyiwen.book.dto.BookDTO;
import top.liyiwen.book.form.add.BookAddForm;
import top.liyiwen.book.form.query.BookQueryForm;
import top.liyiwen.book.model.Book;
import top.liyiwen.book.response.PageResp;
import top.liyiwen.book.response.Response;

import java.util.List;

/**
 * <p>
 * 书籍表 服务类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
public interface BookService extends IService<Book> {

    Response<List<BookDTO>> getHotList(Integer userId);

    Response listShortComment(Integer userId, Integer id);

    Response favorCount(Integer userId);

    Response bookFavor(Integer userId, Integer id);

    Response addShortComment(Integer userId, BookAddForm addForm);

    Response hotKeyword();

    PageResp<BookDTO> search(BookQueryForm queryForm);

    Response bookDetail(Integer id);
}
