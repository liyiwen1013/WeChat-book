package top.liyiwen.book.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
public enum ResponseCode implements IResponseCode, Serializable {

    SUCCESS("00000", "成功"),

    SYSTEM_EXECUTION_ERROR("1000", "系统执行出错"),
    SYSTEM_EXECUTION_TIMEOUT("1001", "系统执行超时"),

    USER_NOT_EXIST("2000", "用户不存在"),
    USER_LOGIN_ERROR("2001", "用户登录异常"),
    USER_PASSWORD_INVALID("2002", "用户账户或密码错误"),
    TOKEN_INVALID_OR_EXPIRED("2003", "token无效或已过期"),
    TOKEN_ACCESS_FORBIDDEN("2004", "token已被禁止访问"),
    PARAM_ERROR("2005", "用户请求参数错误"),
    RESOURCE_NOT_FOUND("2006", "请求资源不存在"),
    PARAM_IS_NULL("2007", "请求必填参数为空"),

    DATA_NOT_EXIST("3000", "数据不存在"),
    DATA_ALREADY_EXIST("3001", "数据已存在"),
    DATA_ADD_ERROR("3002", "数据创建异常"),
    DATA_UPDATE_ERROR("3003", "数据更新异常"),
    DATA_DELETE_ERROR("3004", "数据删除异常"),
    DATA_ACCESS_ERROR("3005", "数据访问异常");

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getMsg() {
        return msg;
    }

    private String code;

    private String msg;

    @Override
    public String toString() {
        return "{" +
                "\"code\":\"" + code + '\"' +
                ", \"msg\":\"" + msg + '\"' +
                '}';
    }


    public static ResponseCode getValue(String code){
        for (ResponseCode value : values()) {
            if (value.getCode().equals(code)) {
                return value;
            }
        }
        return SYSTEM_EXECUTION_ERROR; // 默认系统执行错误
    }
}
