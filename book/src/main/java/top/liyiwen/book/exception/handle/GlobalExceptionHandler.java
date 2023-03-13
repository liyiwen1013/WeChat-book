package top.liyiwen.book.exception.handle;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import top.liyiwen.book.exception.BookException;
import top.liyiwen.book.response.Response;
import top.liyiwen.book.response.ResponseCode;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.stream.Collectors;

/**
 * 全局异常处理
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 处理 @RequestBody 上 @Valid 验证路径中请求实体校验失败后抛出的异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Response methodArgumentNotValidExceptionHandle(MethodArgumentNotValidException e) {
        String errorMsg = e.getBindingResult().getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.toList()).get(0);
        return Response.failed(ResponseCode.PARAM_ERROR, errorMsg);
    }

    /**
     * 处理 Get 请求中 使用 @Valid 验证路径中请求实体校验失败后抛出的异常
     */
    @ExceptionHandler(BindException.class)
    public Response<Object> BindExceptionHandler(BindException e) {
        String errorMsg = e.getBindingResult().getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).collect(Collectors.toList()).get(0);
        return Response.failed(ResponseCode.PARAM_ERROR, errorMsg);
    }

    /**
     * 处理 @RequestParam 上 @Validate 失败后抛出的异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public Response<Object> ConstraintViolationExceptionHandler(ConstraintViolationException e) {
        String errorMsg = e.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.toList()).get(0);
        return Response.failed(ResponseCode.PARAM_ERROR, errorMsg);
    }

    /**
     * 系统服务异常
     */
    @ExceptionHandler(BookException.class)
    public Response bookExceptionHandler(BookException e) {
        log.error("系统服务异常【{}】：{}", e.getErrorCode(), e.getErrorMsg());
        log.error("【系统服务异常】", e);
        return Response.failed(e.getErrorCode(), e.getErrorMsg());
    }

    /**
     * 运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public Response runtimeExceptionHandler(RuntimeException e) {
        log.error("【运行时异常】", e);
        return Response.failed(ResponseCode.SYSTEM_EXECUTION_ERROR);
    }

    /**
     * 数据访问异常
     */
    @ExceptionHandler(DataAccessException.class)
    public Response dataAccessExceptionHandler(DataAccessException e) {
        log.error("【数据访问异常】", e);
        return Response.failed(ResponseCode.DATA_ACCESS_ERROR);
    }

    /**
     * 唯一键冲突异常（数据已经存在）
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public Response dataAlreadyExistsExceptionHandler(DuplicateKeyException e) {
        log.error("【唯一键冲突异常，数据已存在】", e);
        return Response.failed(ResponseCode.DATA_ALREADY_EXIST);
    }

    /**
     * HTTP请求参数转换异常
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Response httpMessageNotReadableExceptionHandler(HttpMessageNotReadableException e) {
        log.error("【HTTP请求参数转换异常】", e);
        return Response.failed(ResponseCode.PARAM_ERROR, "请求参数转换错误");
    }

    /**
     * HTTP请求参数转不支持异常
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public Response httpMediaTypeNotSupportedExceptionHandler(HttpMediaTypeNotSupportedException e) {
        log.error("【HTTP请求参数不支持异常】", e);
        return Response.failed(ResponseCode.PARAM_ERROR, "请求参数不支持");
    }
}