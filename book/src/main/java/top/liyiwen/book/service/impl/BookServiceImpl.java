package top.liyiwen.book.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.liyiwen.book.dto.BookDTO;
import top.liyiwen.book.enums.BookStatusEnum;
import top.liyiwen.book.enums.LikeRecordTypeEnum;
import top.liyiwen.book.exception.BookException;
import top.liyiwen.book.form.add.BookAddForm;
import top.liyiwen.book.form.query.BookQueryForm;
import top.liyiwen.book.mapper.BookMapper;
import top.liyiwen.book.mapper.LikeRecordMapper;
import top.liyiwen.book.model.Book;
import top.liyiwen.book.model.BookCategory;
import top.liyiwen.book.model.BookComment;
import top.liyiwen.book.model.LikeRecord;
import top.liyiwen.book.response.PageResp;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.response.ResponseCode;
import top.liyiwen.book.service.BookCategoryService;
import top.liyiwen.book.service.BookCommentService;
import top.liyiwen.book.service.BookService;

import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    private LikeRecordMapper likeRecordMapper;
    @Autowired
    private BookCategoryService bookCategoryService;
    @Autowired
    private BookCommentService bookCommentService;

    @Override
    public Response<List<BookDTO>> getHotList(Integer userId) {
        LambdaQueryWrapper<Book> bookLambdaQueryWrapper = Wrappers.lambdaQuery(Book.class)
                .select(
                        Book::getId,
                        Book::getCategoryId,
                        Book::getName,
                        Book::getAuthor,
                        Book::getImage)
                .eq(Book::getStatus, BookStatusEnum.ESSENCE.getStatus());
        List<Book> bookList = this.list(bookLambdaQueryWrapper);

        // 获取书籍ID集合
        List<Integer> bookIdList = bookList.stream()
                .map(Book::getId)
                .distinct()
                .collect(Collectors.toList());
        if (bookIdList.isEmpty()) {
            return Response.success(Collections.emptyList());
        }

        // 查询书籍分类
        Set<Integer> categoryIdSet = bookList.stream()
                .map(Book::getCategoryId)
                .collect(Collectors.toSet());
        Map<Integer, String> categoryNameMap = new HashMap<>();
        if (categoryIdSet.size() > 0) {
            LambdaQueryWrapper<BookCategory> bookCategoryLambdaQueryWrapper = Wrappers.lambdaQuery(BookCategory.class)
                    .select(
                            BookCategory::getId,
                            BookCategory::getName)
                    .in(BookCategory::getId, categoryIdSet);
            categoryNameMap = bookCategoryService.list(bookCategoryLambdaQueryWrapper).stream()
                    .collect(Collectors.toMap(BookCategory::getId, BookCategory::getName, (key1, key2) -> key1));
        }

        // 查询该书籍的点赞数量
        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .select(
                        LikeRecord::getUserId,
                        LikeRecord::getTargetId)
                .in(LikeRecord::getTargetId, bookIdList)
                .eq(LikeRecord::getType, LikeRecordTypeEnum.BOOK.getType());
        Map<Integer, Set<Integer>> likeRecordCountMap = likeRecordMapper.selectList(likeRecordLambdaQueryWrapper).stream()
                .collect(Collectors.groupingBy(LikeRecord::getTargetId, Collectors.mapping(LikeRecord::getUserId, Collectors.toSet())));

        List<BookDTO> bookDTOList = new ArrayList<>();
        for (Book book : bookList) {
            BookDTO bookDTO = new BookDTO();
            bookDTO.setId(book.getId());
            bookDTO.setCategoryId(book.getCategoryId());
            bookDTO.setCategoryName(categoryNameMap.getOrDefault(book.getCategoryId(), ""));
            bookDTO.setName(book.getName());
            bookDTO.setAuthor(book.getAuthor());
            bookDTO.setImage(book.getImage());
            bookDTO.setFavNums(likeRecordCountMap.getOrDefault(book.getId(), Collections.emptySet()).size());
            bookDTO.setLikeStatus(!Objects.isNull(userId) && likeRecordCountMap.getOrDefault(book.getId(), Collections.emptySet()).contains(userId));
            bookDTOList.add(bookDTO);
        }

        return Response.success(bookDTOList);
    }

    @Override
    public Response listShortComment(Integer userId, Integer id) {
        LambdaQueryWrapper<BookComment> bookCommentLambdaQueryWrapper = Wrappers.lambdaQuery(BookComment.class)
                .select(BookComment::getContent)
                .eq(BookComment::getBookId, id);
        List<BookComment> commentList = bookCommentService.list(bookCommentLambdaQueryWrapper);

        Map<String, Integer> map = new HashMap<>();
        for (BookComment bookComment : commentList) {
            map.put(bookComment.getContent(), map.getOrDefault(bookComment.getContent(), 0) + 1);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("content", entry.getKey());
            tmp.put("nums", entry.getValue());
            result.add(tmp);
        }

        return Response.success(result);
    }

    @Override
    public Response favorCount(Integer userId) {
        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .eq(LikeRecord::getType, LikeRecordTypeEnum.BOOK.getType())
                .eq(LikeRecord::getUserId, userId);
        int count = likeRecordMapper.selectCount(likeRecordLambdaQueryWrapper);
        return Response.success(count);
    }

    @Override
    public Response bookFavor(Integer userId, Integer id) {
        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .eq(LikeRecord::getTargetId, id)
                .eq(LikeRecord::getType, LikeRecordTypeEnum.BOOK.getType());
        int count1 = likeRecordMapper.selectCount(likeRecordLambdaQueryWrapper);
        likeRecordLambdaQueryWrapper
                .eq(LikeRecord::getUserId, userId);
        int count2 = likeRecordMapper.selectCount(likeRecordLambdaQueryWrapper);
        Map<String, Object> res = new HashMap<>();
        res.put("id", id);
        res.put("favNums", count1);
        res.put("likeStatus", count2 != 0);
        return Response.success(res);
    }

    @Override
    public Response addShortComment(Integer userId, BookAddForm addForm) {
        // 构建参数
        Integer bookId = addForm.getBookId();
        String content = addForm.getContent();

        BookComment bookComment = new BookComment();
        bookComment.setBookId(bookId);
        bookComment.setUserId(userId);
        bookComment.setContent(content);
        boolean res = bookCommentService.save(bookComment);
        if (!res) {
            throw new BookException(ResponseCode.DATA_ADD_ERROR, "新增短评失败");
        }

        return Response.success();
    }

    @Override
    public Response hotKeyword() {
        List<String> hotKeywordList = new ArrayList<>();
        hotKeywordList.add("小程序Java核心编程");
        hotKeywordList.add("微信小程序开发入门与实践");
        hotKeywordList.add("Python");
        hotKeywordList.add("金庸");
        hotKeywordList.add("白夜行");
        return Response.success(hotKeywordList);
    }

    @Override
    public PageResp<BookDTO> search(BookQueryForm queryForm) {
        // 构建参数
        String q = queryForm.getQ();
        Integer summary = queryForm.getSummary();
        Integer current = queryForm.getCurrent();
        Integer size = queryForm.getSize();

        Page<Book> bookPage = new Page<>(current, size);
        Page<BookDTO> res = new Page<>(current, size);
        if (summary == 0) {
            LambdaQueryWrapper<Book> bookLambdaQueryWrapper = Wrappers.lambdaQuery(Book.class)
                    .select(
                            Book::getId,
                            Book::getAuthor,
                            Book::getBinding,
                            Book::getCategoryId,
                            Book::getImage,
                            Book::getIsbn,
                            Book::getPages,
                            Book::getPrice,
                            Book::getPubdate,
                            Book::getPublisher,
                            Book::getSubtitle,
                            Book::getSummary)
                    .like(Book::getName, q);
            Page<Book> page = this.page(bookPage, bookLambdaQueryWrapper);

            // 查询分类
            Set<Integer> bookCategoryIdSet = page.getRecords().stream()
                    .map(Book::getCategoryId)
                    .collect(Collectors.toSet());
            Map<Integer, String> bookCategoryNameMap = new HashMap<>();
            if (bookCategoryIdSet.size() > 0) {
                LambdaQueryWrapper<BookCategory> bookCategoryLambdaQueryWrapper = Wrappers.lambdaQuery(BookCategory.class)
                        .select(BookCategory::getName)
                        .in(BookCategory::getId, bookCategoryIdSet);
                bookCategoryNameMap = bookCategoryService.list(bookCategoryLambdaQueryWrapper).stream()
                        .collect(Collectors.toMap(BookCategory::getId, BookCategory::getName, (key1, key2) -> key1));
            }

            List<BookDTO> bookDTOList = new ArrayList<>();
            for (Book book : page.getRecords()) {
                BookDTO bookDTO = new BookDTO();
                bookDTO.setId(book.getId());
                bookDTO.setAuthor(book.getAuthor());
                bookDTO.setBinding(book.getBinding());
                bookDTO.setCategoryId(book.getCategoryId());
                bookDTO.setCategoryName(bookCategoryNameMap.getOrDefault(book.getCategoryId(), ""));
                bookDTO.setImage(book.getImage());
                bookDTO.setIsbn(book.getIsbn());
                bookDTO.setPages(book.getPages());
                bookDTO.setPrice(book.getPrice());
                bookDTO.setPubdate(book.getPubdate());
                bookDTO.setPublisher(book.getPublisher());
                bookDTO.setSubtitle(book.getSubtitle());
                bookDTO.setSummary(book.getSummary());
                bookDTOList.add(bookDTO);
            }
            res.setRecords(bookDTOList);
            res.setTotal(page.getTotal());
        } else {
            LambdaQueryWrapper<Book> bookLambdaQueryWrapper = Wrappers.lambdaQuery(Book.class)
                    .select(
                            Book::getId,
                            Book::getAuthor,
                            Book::getImage,
                            Book::getIsbn,
                            Book::getPrice,
                            Book::getName)
                    .like(Book::getName, q);
            Page<Book> page = this.page(bookPage, bookLambdaQueryWrapper);

            List<BookDTO> bookDTOList = new ArrayList<>();
            for (Book book : page.getRecords()) {
                BookDTO bookDTO = new BookDTO();
                bookDTO.setId(book.getId());
                bookDTO.setAuthor(book.getAuthor());
                bookDTO.setImage(book.getImage());
                bookDTO.setIsbn(book.getIsbn());
                bookDTO.setPrice(book.getPrice());
                bookDTO.setName(book.getName());
                bookDTOList.add(bookDTO);
            }
            res.setRecords(bookDTOList);
            res.setTotal(page.getTotal());
        }
        return PageResp.success(res);
    }

    @Override
    public Response bookDetail(Integer id) {
        LambdaQueryWrapper<Book> bookLambdaQueryWrapper = Wrappers.lambdaQuery(Book.class)
                .select(
                        Book::getId,
                        Book::getAuthor,
                        Book::getBinding,
                        Book::getCategoryId,
                        Book::getImage,
                        Book::getIsbn,
                        Book::getPages,
                        Book::getPrice,
                        Book::getPubdate,
                        Book::getPublisher,
                        Book::getSubtitle,
                        Book::getSummary,
                        Book::getName,
                        Book::getTranslator)
                .eq(Book::getId, id);
        Book book = this.getOne(bookLambdaQueryWrapper);

        // 查询分类名
        LambdaQueryWrapper<BookCategory> bookCategoryLambdaQueryWrapper = Wrappers.lambdaQuery(BookCategory.class)
                .select(BookCategory::getName)
                .eq(BookCategory::getId, book.getCategoryId());
        BookCategory bookCategory = bookCategoryService.getOne(bookCategoryLambdaQueryWrapper);

        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setName(book.getName());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setBinding(book.getBinding());
        bookDTO.setCategoryId(book.getCategoryId());
        bookDTO.setCategoryName(Objects.isNull(bookCategory) ? "" : bookCategory.getName());
        bookDTO.setImage(book.getImage());
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setPages(book.getPages());
        bookDTO.setPrice(book.getPrice());
        bookDTO.setPubdate(book.getPubdate());
        bookDTO.setPublisher(book.getPublisher());
        bookDTO.setSubtitle(book.getSubtitle());
        bookDTO.setSummary(book.getSummary());
        bookDTO.setTranslator(book.getTranslator());
        // 返回
        return Response.success(bookDTO);
    }
}
