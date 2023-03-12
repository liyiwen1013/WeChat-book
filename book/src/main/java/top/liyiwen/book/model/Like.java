package top.liyiwen.book.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.Version;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableLogic;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 点赞表
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@ApiModel(value="Like对象", description="点赞表")
public class Like extends Model {

    private static final long serialVersionUID=1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "用户ID")
    private Integer userId;

    @ApiModelProperty(value = "目标ID")
    private Integer targetId;

    @ApiModelProperty(value = "点赞类型 1:书籍 2:期刊")
    private Integer type;

    @ApiModelProperty(value = "创建记录时间")
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新记录时间")
    @Version
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "逻辑删除 0:正常 1:删除")
    @TableLogic
    private Boolean deleted;


}
