package top.liyiwen.book.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum LikeRecordTypeEnum {

    BOOK(1, "书籍"),
    JOURNAL(2, "期刊");

    private final Integer type;
    private final String desc;

}