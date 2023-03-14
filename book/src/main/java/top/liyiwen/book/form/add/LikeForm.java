package top.liyiwen.book.form.add;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

@Data
public class LikeForm {

    @Range(min = 1, max = 999999999, message = "id错误")
    @NotNull(message = "id不能为空")
    private Integer id;

    @Range(min = 1, max = 2, message = "type错误")
    @NotNull(message = "type不能为空")
    private Integer type;

}