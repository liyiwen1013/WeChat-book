package top.liyiwen.book.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.liyiwen.book.enums.LikeRecordTypeEnum;
import top.liyiwen.book.exception.BookException;
import top.liyiwen.book.form.add.LikeForm;
import top.liyiwen.book.mapper.LikeRecordMapper;
import top.liyiwen.book.model.Book;
import top.liyiwen.book.model.Journal;
import top.liyiwen.book.model.LikeRecord;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.response.ResponseCode;
import top.liyiwen.book.service.BookService;
import top.liyiwen.book.service.JournalService;
import top.liyiwen.book.service.LikeRecordService;

/**
 * <p>
 * 点赞表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-13
 */
@Service
public class LikeRecordServiceImpl extends ServiceImpl<LikeRecordMapper, LikeRecord> implements LikeRecordService {

    @Autowired
    private BookService bookService;
    @Autowired
    private JournalService journalService;

    @Override
    public Response like(Integer userId, LikeForm likeForm) {
        // 构建参数
        Integer id = likeForm.getId();
        Integer type = likeForm.getType();

        LikeRecord likeRecord = new LikeRecord();
        likeRecord.setUserId(userId);
        likeRecord.setTargetId(id);
        if (LikeRecordTypeEnum.BOOK.getType().equals(type)) {
            // 检查书籍是否存在
            LambdaQueryWrapper<Book> bookLambdaQueryWrapper = Wrappers.lambdaQuery(Book.class)
                    .eq(Book::getId, id);
            int count = bookService.count(bookLambdaQueryWrapper);
            if (0 == count) {
                return Response.failed(ResponseCode.DATA_NOT_EXIST, "书籍不存在");
            }
            // 检查是否点赞过
            LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                    .eq(LikeRecord::getTargetId, id)
                    .eq(LikeRecord::getUserId, userId)
                    .eq(LikeRecord::getType, LikeRecordTypeEnum.BOOK.getType());
            count = this.count(likeRecordLambdaQueryWrapper);
            if (count > 0) {
                return Response.failed(ResponseCode.DATA_ALREADY_EXIST, "你已点赞过");
            }
            likeRecord.setType(LikeRecordTypeEnum.BOOK.getType());
        } else if (LikeRecordTypeEnum.JOURNAL.getType().equals(type)) {
            // 检查期刊是否存在
            LambdaQueryWrapper<Journal> journalLambdaQueryWrapper = Wrappers.lambdaQuery(Journal.class)
                    .eq(Journal::getId, id);
            int count = journalService.count(journalLambdaQueryWrapper);
            if (0 == count) {
                return Response.failed(ResponseCode.DATA_NOT_EXIST, "期刊不存在");
            }
            // 检查是否点赞过
            LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                    .eq(LikeRecord::getTargetId, id)
                    .eq(LikeRecord::getUserId, userId)
                    .eq(LikeRecord::getType, LikeRecordTypeEnum.JOURNAL.getType());
            count = this.count(likeRecordLambdaQueryWrapper);
            if (count > 0) {
                return Response.failed(ResponseCode.DATA_ALREADY_EXIST, "你已点赞过");
            }
            likeRecord.setType(LikeRecordTypeEnum.JOURNAL.getType());
        }

        // 写入数据库
        boolean res = this.save(likeRecord);
        if (!res) {
            throw new BookException(ResponseCode.DATA_ADD_ERROR, "点赞失败");
        }

        return Response.success();
    }

    @Override
    public Response cancelLike(Integer userId, LikeForm likeForm) {
        // 构建参数
        Integer id = likeForm.getId();
        Integer type = likeForm.getType();

        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .eq(LikeRecord::getTargetId, id)
                .eq(LikeRecord::getUserId, userId)
                .eq(LikeRecord::getType, type);
        this.remove(likeRecordLambdaQueryWrapper);

        return Response.success();
    }
}
