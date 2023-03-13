package top.liyiwen.book.form.login;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;

@Data
public class UserLoginForm {

    @NotNull(message = "code不能为空")
    private String code;

    @Length(min = 1, max = 20, message = "nickname长度错误")
    @NotNull(message = "nickname不能为空")
    private String nickname;

    @Length(min = 1, message = "avatar不能为空")
    @NotNull(message = "avatar不能为空")
    private String avatar;

}