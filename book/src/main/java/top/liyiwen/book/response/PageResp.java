package top.liyiwen.book.response;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页响应结构体
 * @param <T>
 */
@Data
public class PageResp <T> implements Serializable {

    private String code;

    private Data<T> data;

    private String msg;

    public static <T> PageResp<T> success(IPage<T> page) {
        PageResp<T> result = new PageResp<>();
        result.setCode(ResponseCode.SUCCESS.getCode());

        Data<T> data = new Data<>();
        data.setList(page.getRecords());
        data.setTotal(page.getTotal());
        data.setStart(page.getCurrent());
        data.setCount(page.getSize());
        data.setPages(page.getPages());

        result.setData(data);
        result.setMsg(ResponseCode.SUCCESS.getMsg());
        return result;
    }

    public static <T> PageResp<T> failed(ResponseCode responseCode, String msg) {
        PageResp<T> result = new PageResp<>();
        result.setCode(responseCode.getCode());
        result.setMsg(msg);
        return result;
    }

    public static <T> PageResp<T> failed(ResponseCode responseCode) {
        PageResp<T> result = new PageResp<>();
        result.setCode(responseCode.getCode());
        result.setMsg(responseCode.getMsg());
        return result;
    }

    @lombok.Data
    public static class Data<T> {

        private List<T> list;

        private long total;

        private long start;

        private long count;

        private long pages;
    }
}
