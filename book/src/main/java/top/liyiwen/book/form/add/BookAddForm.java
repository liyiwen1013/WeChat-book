package top.liyiwen.book.form.add;

import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

@Data
public class BookAddForm {

    @Range(min = 1, max = 999999999, message = "bookId错误")
    @NotNull(message = "bookId不能为空")
    private Integer bookId;

    @Length(min = 1, max = 20, message = "短评内容长度错误")
    @NotNull(message = "content不能为空")
    private String content;

}