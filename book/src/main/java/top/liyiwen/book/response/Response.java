package top.liyiwen.book.response;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结构体
 *
 * @author haoxr
 * @date 2022/1/30
 **/
@Data
public class Response<T> implements Serializable {

    private String code;

    private T data;

    private String msg;

    public static <T> Response<T> success() {
        return success(null);
    }

    public static <T> Response<T> success(T data) {
        Response<T> resp = new Response<>();
        resp.setCode(ResponseCode.SUCCESS.getCode());
        resp.setMsg(ResponseCode.SUCCESS.getMsg());
        resp.setData(data);
        return resp;
    }

    public static <T> Response<T> failed() {
        return resp(ResponseCode.SYSTEM_EXECUTION_ERROR.getCode(), ResponseCode.SYSTEM_EXECUTION_ERROR.getMsg(), null);
    }

    public static <T> Response<T> failed(String msg) {
        return resp(ResponseCode.SYSTEM_EXECUTION_ERROR.getCode(), msg, null);
    }

    public static <T> Response<T> judge(boolean status) {
        if (status) {
            return success();
        } else {
            return failed();
        }
    }

    public static <T> Response<T> failed(IResponseCode respCode) {
        return resp(respCode.getCode(), respCode.getMsg(), null);
    }

    public static <T> Response<T> failed(IResponseCode respCode, String msg) {
        return resp(respCode.getCode(), msg, null);
    }

    private static <T> Response<T> resp(IResponseCode respCode, T data) {
        return resp(respCode.getCode(), respCode.getMsg(), data);
    }

    private static <T> Response<T> resp(String code, String msg, T data) {
        Response<T> resp = new Response<>();
        resp.setCode(code);
        resp.setData(data);
        resp.setMsg(msg);
        return resp;
    }

    public static boolean isSuccess(Response<?> resp) {
        return resp != null && ResponseCode.SUCCESS.getCode().equals(resp.getCode());
    }

    public static boolean isFailed(Response<?> resp) {
        return resp == null || !ResponseCode.SUCCESS.getCode().equals(resp.getCode());
    }
}