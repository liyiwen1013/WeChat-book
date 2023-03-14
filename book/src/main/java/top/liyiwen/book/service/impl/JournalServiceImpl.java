package top.liyiwen.book.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.liyiwen.book.dto.JournalDTO;
import top.liyiwen.book.enums.LikeRecordTypeEnum;
import top.liyiwen.book.mapper.JournalMapper;
import top.liyiwen.book.mapper.LikeRecordMapper;
import top.liyiwen.book.model.Journal;
import top.liyiwen.book.model.LikeRecord;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.JournalService;

import java.util.*;
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
    private LikeRecordMapper likeRecordMapper;

    @Override
    public Response getOneJournal(Integer userId, Integer id, Integer type) {
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
        if (type == 0) {
            // 获取最新一期
        } else if (type == 1) {
            // 获取指定一期
            journalLambdaQueryWrapper
                    .eq(Journal::getId, id);
        } else if (type == 2) {
            // 获取当前一期的下一期
            journalLambdaQueryWrapper
                    .lt(Journal::getId, id);
        } else if (type == 3) {
            // 获取当前一期的上一期
            journalLambdaQueryWrapper
                    .gt(Journal::getId, id);
        }
        Journal journal = this.getOne(journalLambdaQueryWrapper);
        if (Objects.isNull(journal)) {
            return Response.success();
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
        Set<Integer> userIdSet = likeRecordMapper.selectList(likeRecordLambdaQueryWrapper).stream()
                .map(LikeRecord::getUserId)
                .collect(Collectors.toSet());
        journalDTO.setFavNums(userIdSet.size());
        journalDTO.setLikeStatus(!Objects.isNull(userId) && userIdSet.contains(userId));

        return Response.success(journalDTO);
    }

    @Override
    public Response<List<JournalDTO>> listMyFavor(Integer userId) {
        // 用户未登录
        if (Objects.isNull(userId)) {
            return Response.success(Collections.emptyList());
        }

        // 查询我点赞的期刊列表，按照点赞时间降序排序
        LambdaQueryWrapper<LikeRecord> likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .select(LikeRecord::getTargetId)
                .eq(LikeRecord::getUserId, userId)
                .eq(LikeRecord::getType, LikeRecordTypeEnum.JOURNAL.getType())
                .orderByDesc(LikeRecord::getCreateTime);
        List<Integer> journalIdList = likeRecordMapper.selectList(likeRecordLambdaQueryWrapper).stream()
                .map(LikeRecord::getTargetId)
                .distinct()
                .collect(Collectors.toList());
        if (journalIdList.isEmpty()) {
            return Response.success(Collections.emptyList());
        }

        // 获取用户点赞的期刊列表
        LambdaQueryWrapper<Journal> journalLambdaQueryWrapper = Wrappers.lambdaQuery(Journal.class)
                .select(
                        Journal::getId,
                        Journal::getTitle,
                        Journal::getContent,
                        Journal::getImage,
                        Journal::getType,
                        Journal::getUrl,
                        Journal::getCreateTime)
                .in(Journal::getId, journalIdList);
        List<Journal> journalList = this.list(journalLambdaQueryWrapper);

        // 计算期刊的点赞数量
        likeRecordLambdaQueryWrapper = Wrappers.lambdaQuery(LikeRecord.class)
                .select(
                        LikeRecord::getUserId,
                        LikeRecord::getTargetId)
                .in(LikeRecord::getTargetId, journalIdList);
        Map<Integer, List<LikeRecord>> journalLikeCountMap = likeRecordMapper.selectList(likeRecordLambdaQueryWrapper).stream()
                .collect(Collectors.groupingBy(LikeRecord::getTargetId, Collectors.toList()));

        Map<Integer, JournalDTO> journalDTOMap = new HashMap<>();
        for (Journal journal : journalList) {
            JournalDTO journalDTO = new JournalDTO();
            journalDTO.setId(journal.getId());
            journalDTO.setTitle(journal.getTitle());
            journalDTO.setContent(journal.getContent());
            journalDTO.setImage(journal.getImage());
            journalDTO.setType(journal.getType());
            journalDTO.setUrl(journal.getUrl());
            journalDTO.setPubdate(journal.getCreateTime());
            journalDTO.setFavNums(journalLikeCountMap.getOrDefault(journal.getId(), Collections.emptyList()).size());
            journalDTO.setLikeStatus(true);
            journalDTOMap.put(journal.getId(), journalDTO);
        }

        // 对期刊进行排序
        List<JournalDTO> journalDTOList = new ArrayList<>();
        for (Integer journalId : journalIdList) {
            if (journalDTOMap.containsKey(journalId)) {
                journalDTOList.add(journalDTOMap.get(journalId));
            }
        }

        // 返回
        return Response.success(journalDTOList);
    }
}
