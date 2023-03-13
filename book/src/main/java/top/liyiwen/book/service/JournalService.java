package top.liyiwen.book.service;

import top.liyiwen.book.model.Journal;
import com.baomidou.mybatisplus.extension.service.IService;
import top.liyiwen.book.response.Response;

/**
 * <p>
 * 期刊表 服务类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
public interface JournalService extends IService<Journal> {

    Response latest(Integer userId);
}
