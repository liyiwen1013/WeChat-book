package top.liyiwen.book.service;

import top.liyiwen.book.form.add.LikeForm;
import top.liyiwen.book.model.LikeRecord;
import com.baomidou.mybatisplus.extension.service.IService;
import top.liyiwen.book.response.Response;

/**
 * <p>
 * 点赞表 服务类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-13
 */
public interface LikeRecordService extends IService<LikeRecord> {

    Response like(Integer userId, LikeForm likeForm);

    Response cancelLike(Integer userId, LikeForm likeForm);

}
