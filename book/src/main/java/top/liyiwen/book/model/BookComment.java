package top.liyiwen.book.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.Version;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * <p>
 * 书籍评论表
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel(value = "BookComment对象", description = "书籍评论表")
public class BookComment extends Model {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "用户ID")
    private Integer userId;

    @ApiModelProperty(value = "书籍ID")
    private Integer bookId;

    @ApiModelProperty(value = "内容")
    private String content;

    @ApiModelProperty(value = "创建记录时间")
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新记录时间")
    @Version
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "逻辑删除 0:正常 1:删除")
    @TableLogic
    private Boolean deleted;


}
