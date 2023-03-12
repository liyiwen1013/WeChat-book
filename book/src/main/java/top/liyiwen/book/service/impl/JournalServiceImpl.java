package top.liyiwen.book.service.impl;

import top.liyiwen.book.model.Journal;
import top.liyiwen.book.mapper.JournalMapper;
import top.liyiwen.book.service.JournalService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 期刊表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Service
public class JournalServiceImpl extends ServiceImpl<JournalMapper, Journal> implements JournalService {

}
