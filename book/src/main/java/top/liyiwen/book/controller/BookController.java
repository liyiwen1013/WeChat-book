package top.liyiwen.book.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.liyiwen.book.dto.BookDTO;
import top.liyiwen.book.form.add.BookAddForm;
import top.liyiwen.book.form.query.BookQueryForm;
import top.liyiwen.book.response.PageResp;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.BookService;
import top.liyiwen.book.utils.JwtUtil;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/book")
@Slf4j
@Validated
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping("/hot_list")
    public Response<List<BookDTO>> getHotList() {
        Integer userId = JwtUtil.getUserId();
        return bookService.getHotList(userId);
    }

    @GetMapping("/{id}/short_comment")
    public Response listShortComment(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return bookService.listShortComment(userId, id);
    }

    @GetMapping("/favor/count")
    public Response favorCount() {
        Integer userId = JwtUtil.getUserId();
        return bookService.favorCount(userId);
    }

    @GetMapping("/{id}/favor")
    public Response bookFavor(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return bookService.bookFavor(userId, id);
    }

    @PostMapping("/short_comment")
    public Response addShortComment(@Valid @RequestBody BookAddForm addForm) {
        Integer userId = JwtUtil.getUserId();
        return bookService.addShortComment(userId, addForm);
    }

    @GetMapping("/hot_keyword")
    public Response hotKeyword() {
        return bookService.hotKeyword();
    }

    @GetMapping("/search")
    public PageResp<BookDTO> search(@Valid BookQueryForm queryForm) {
        return bookService.search(queryForm);
    }

    @GetMapping("/{id}/detail")
    public Response bookDetail(@PathVariable("id") Integer id) {
        return bookService.bookDetail(id);
    }

}