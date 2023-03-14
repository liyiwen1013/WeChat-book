package top.liyiwen.book.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.liyiwen.book.form.add.LikeForm;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.LikeRecordService;
import top.liyiwen.book.utils.JwtUtil;

import javax.validation.Valid;

@RestController
@RequestMapping("/like")
@Slf4j
@Validated
public class LikeController {

    @Autowired
    private LikeRecordService likeRecordService;

    @PostMapping()
    public Response like(@Valid @RequestBody LikeForm likeForm) {
        Integer userId = JwtUtil.getUserId();
        return likeRecordService.like(userId, likeForm);
    }

    @PostMapping("/cancel")
    public Response cancelLike(@Valid @RequestBody LikeForm likeForm) {
        Integer userId = JwtUtil.getUserId();
        return likeRecordService.cancelLike(userId, likeForm);
    }
}