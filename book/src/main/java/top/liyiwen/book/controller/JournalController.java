package top.liyiwen.book.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.liyiwen.book.dto.JournalDTO;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.JournalService;
import top.liyiwen.book.utils.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/classic")
@Slf4j
@Validated
public class JournalController {

    @Autowired
    private JournalService journalService;

    @GetMapping("/latest")
    public Response latest() {
        Integer userId = JwtUtil.getUserId();
        return journalService.getOneJournal(userId, null, 0);
    }

    @GetMapping("/{id}")
    public Response detail(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return journalService.getOneJournal(userId, id, 1);
    }

    @GetMapping("/{id}/next")
    public Response next(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return journalService.getOneJournal(userId, id, 2);
    }

    @GetMapping("/{id}/previous")
    public Response previous(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return journalService.getOneJournal(userId, id, 3);
    }

    @GetMapping("/{id}/favor")
    public Response favorCount(@PathVariable("id") Integer id) {
        Integer userId = JwtUtil.getUserId();
        return journalService.favorCount(userId, id);
    }

    @GetMapping("/favor")
    public Response<List<JournalDTO>> favor() {
        Integer userId = JwtUtil.getUserId();
        return journalService.listMyFavor(userId);
    }

}
