package top.liyiwen.book.form.query;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class BookQueryForm {

    @Range(min = 1, message = "当前页")
    private Integer current = 1;

    @Range(min = 1, max = 20, message = "每页数量最多为20")
    private Integer size = 20;

    @Range(min = 0, max = 1, message = "summary值为0/1")
    private Integer summary = 0;

    private String q = "";

}