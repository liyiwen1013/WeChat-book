package top.liyiwen.book.service;

import com.baomidou.mybatisplus.extension.service.IService;
import top.liyiwen.book.dto.JournalDTO;
import top.liyiwen.book.model.Journal;
import top.liyiwen.book.response.Response;

import java.util.List;

/**
 * <p>
 * 期刊表 服务类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
public interface JournalService extends IService<Journal> {

    Response getOneJournal(Integer userId, Integer id, Integer type);

    Response<List<JournalDTO>> listMyFavor(Integer userId);

    Response favorCount(Integer userId, Integer id);
}
