package top.liyiwen.book.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JournalDTO {

    private Integer id;

    private String title;

    private String content;

    private String image;

    private Integer type;

    private String url;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime pubdate;

    private Integer favNums;

    private Boolean likeStatus;

}