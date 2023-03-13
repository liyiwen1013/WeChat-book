package top.liyiwen.book.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.service.JournalService;

@RestController
@RequestMapping("/classic")
@Slf4j
@Validated
public class JournalController {

    @Autowired
    private JournalService journalService;

    @GetMapping("/latest")
    public Response latest() {
        Integer userId = (Integer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return journalService.latest(userId);
    }

}