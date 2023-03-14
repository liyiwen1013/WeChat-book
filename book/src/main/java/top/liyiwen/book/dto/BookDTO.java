package top.liyiwen.book.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookDTO {

    private Integer id;

    private String name;

    private List<String> author;

    private String binding;

    private Integer categoryId;

    private String categoryName;

    private String image;

    private String isbn;

    private Integer pages;

    private BigDecimal price;

    private String publisher;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate pubdate;

    private String subtitle;

    private String summary;

    private String translator;

    private Integer status;

    private Integer favNums;

    private Boolean likeStatus;

}