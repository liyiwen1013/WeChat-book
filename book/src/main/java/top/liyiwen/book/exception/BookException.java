package top.liyiwen.book.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import top.liyiwen.book.response.IResponseCode;
import top.liyiwen.book.response.ResponseCode;

/**
 * 自定义异常
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class BookException extends RuntimeException {

    /**
     * 错误码
     */
    private IResponseCode errorCode;

    /**
     * 错误信息
     */
    private String errorMsg;

    public BookException() {
        super();
        this.errorCode = ResponseCode.SYSTEM_EXECUTION_ERROR;
        this.errorMsg = ResponseCode.SYSTEM_EXECUTION_ERROR.getMsg();
    }

    public BookException(IResponseCode resultCode) {
        super(resultCode.getMsg());
        this.errorCode = resultCode;
        this.errorMsg = resultCode.getMsg();
    }

    public BookException(IResponseCode resultCode, Throwable cause) {
        super(resultCode.getMsg(), cause);
        this.errorCode = resultCode;
        this.errorMsg = resultCode.getMsg();
    }

    public BookException(String errorMsg) {
        super(errorMsg);
        this.errorCode = ResponseCode.SYSTEM_EXECUTION_ERROR;
        this.errorMsg = errorMsg;
    }

    public BookException(String errorMsg, Throwable cause) {
        super(errorMsg, cause);
        this.errorCode = ResponseCode.SYSTEM_EXECUTION_ERROR;;
        this.errorMsg = errorMsg;
    }

    public BookException(IResponseCode resultCode, String errorMsg) {
        super(errorMsg);
        this.errorCode = resultCode;
        this.errorMsg = errorMsg;
    }

}