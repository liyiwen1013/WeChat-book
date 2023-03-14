package top.liyiwen.book.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BookStatusEnum {

    NORMAL(0, "普通"),
    ESSENCE(1, "精华");

    private final Integer status;
    private final String desc;

}