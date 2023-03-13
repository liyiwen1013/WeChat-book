package top.liyiwen.book.model;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 书籍表
 * </p>
 *
 * @author liyiwen
 * @since 2023-03-12
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName(autoResultMap = true)
@ApiModel(value = "Book对象", description = "书籍表")
public class Book extends Model {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "书籍名称")
    private String name;

    @ApiModelProperty(value = "作者列表(数组)")
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> author;

    @ApiModelProperty(value = "精装/平装")
    private String binding;

    @ApiModelProperty(value = "书籍分类ID")
    @TableField("categoryId")
    private Integer categoryId;

    @ApiModelProperty(value = "书籍图片")
    private String image;

    @ApiModelProperty(value = "书籍ISBN编号")
    private String isbn;

    @ApiModelProperty(value = "总页数")
    private Integer pages;

    @ApiModelProperty(value = "书籍价格")
    private BigDecimal price;

    @ApiModelProperty(value = "出版社")
    private String publisher;

    @ApiModelProperty(value = "出版日期")
    private LocalDate pubdate;

    @ApiModelProperty(value = "子标题")
    private String subtitle;

    @ApiModelProperty(value = "摘要")
    private String summary;

    @ApiModelProperty(value = "翻译者")
    private String translator;

    @ApiModelProperty(value = "是否加精 0:正常 1:精选")
    private Integer status;

    @ApiModelProperty(value = "创建记录时间")
    private LocalDateTime createTime;

    @ApiModelProperty(value = "更新记录时间")
    @Version
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "逻辑删除 0:正常 1:删除")
    @TableLogic
    private Boolean deleted;


}
