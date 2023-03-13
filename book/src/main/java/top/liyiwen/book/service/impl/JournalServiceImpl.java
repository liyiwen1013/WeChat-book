package top.liyiwen.book.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.liyiwen.book.dto.JournalDTO;
import top.liyiwen.book.enums.LikeRecordTypeEnum;
import top.liyiwen.book.mapper.JournalMapper;
import top.liyiwen.book.model.Journal;
import top.liyiwen.book.model.LikeRecord;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.JournalService;
import top.liyiwen.book.service.LikeRecordService;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * <p>
 * 期刊表 服务实现类
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-13
 */
@Service
public class JournalServiceImpl extends ServiceImpl<JournalMapper, Journal> implements JournalService {

    @Autowired
    private LikeRecordService likeRecordService;

    @Override
    public Response latest(Integer userId) {
        LambdaQueryWrapper<Journal> journalLambdaQueryWrapper = Wrappers.lambdaQuery(Journal.class)
                .select(
                        Journal::getId,
                        Journal::getTitle,
                        Journal::getContent,
                        Journal::getImage,
                        Journal::getType,
                        Journal::getUrl,
                        Journal::getCreateTime)
                .orderByDesc(Journal::getId)
                .last("limit 1");
        Journal journal = this.getOne(journalLambdaQueryWrapper);
        if (Objects.isNull(journal)) {
            return Response.success(new JournalDTO());
        }

        JournalDTO journalDTO = new JournalDTO();
        journalDTO.setId(journal.getId());
        journalDTO.setTitle(journal.getTitle());
        journalDTO.setContent(journal.getContent());
        journalDTO.setImage(journal.getImage());
        journalDTO.setType(journal.getType());
        journalDTO.setUrl(journal.getUrl());
        journalDTO.setPubdate(journal.getCreateTime());

        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .select(LikeRecord::getUserId)
                .eq(LikeRecord::getTargetId, journal.getId())
                .eq(LikeRecord::getUpdateTime, LikeRecordTypeEnum.JOURNAL.getType());
        Set<Integer> userIdSet = likeRecordService.list(likeRecordLambdaQueryWrapper).stream()
                .map(LikeRecord::getUserId)
                .collect(Collectors.toSet());
        journalDTO.setFavNums(userIdSet.size());
        journalDTO.setLikeStatus(!Objects.isNull(userId) && userIdSet.contains(userId));

        return Response.success(journalDTO);
    }
}
