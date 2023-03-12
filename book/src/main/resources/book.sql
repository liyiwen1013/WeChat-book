SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book_category
-- ----------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '' COMMENT '分类名称',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name`(`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '书籍分类表';

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(63) NOT NULL DEFAULT '' COMMENT '书籍名称',
  `author` varchar(255) NOT NULL DEFAULT '[]' COMMENT '作者列表(数组)',
  `binding` varchar(63) NOT NULL DEFAULT '' COMMENT '精装/平装',
  `categoryId` int(11) NOT NULL COMMENT '书籍分类ID',
  `image` varchar(255) NOT NULL DEFAULT '' COMMENT '书籍图片',
  `isbn` varchar(63) NOT NULL DEFAULT '' COMMENT '书籍ISBN编号',
  `pages` int(11) NOT NULL DEFAULT 0 COMMENT '总页数',
  `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '书籍价格',
  `publisher` varchar(63) NOT NULL DEFAULT '' COMMENT '出版社',
  `pubdate` date NOT NULL COMMENT '出版日期',
  `subtitle` varchar(63) NOT NULL DEFAULT '' COMMENT '子标题',
  `summary` varchar(1024) NOT NULL DEFAULT '' COMMENT '摘要',
  `translator` varchar(63) NOT NULL DEFAULT '' COMMENT '翻译者',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '是否加精 0:正常 1:精选',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '书籍表';

-- ----------------------------
-- Table structure for book_comment
-- ----------------------------
DROP TABLE IF EXISTS `book_comment`;
CREATE TABLE `book_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `book_id` int(11) NOT NULL COMMENT '书籍ID',
  `content` varchar(63) NOT NULL DEFAULT '' COMMENT '内容',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '书籍评论表';

-- ----------------------------
-- Table structure for journal
-- ----------------------------
DROP TABLE IF EXISTS `journal`;
CREATE TABLE `journal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(63) NOT NULL DEFAULT '' COMMENT '期刊标题',
  `content` varchar(255) NOT NULL DEFAULT '' COMMENT '期刊内容',
  `image` varchar(255) NOT NULL DEFAULT '' COMMENT '期刊图片',
  `type` tinyint(4) NOT NULL COMMENT '点赞类型 1:电影 2:音乐 3:句子',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '音乐地址',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '期刊表';

-- ----------------------------
-- Table structure for like
-- ----------------------------
DROP TABLE IF EXISTS `like`;
CREATE TABLE `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `target_id` int(11) NOT NULL COMMENT '目标ID',
  `type` tinyint(4) NOT NULL COMMENT '点赞类型 1:书籍 2:期刊',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '点赞表';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL DEFAULT '' COMMENT '用户名称',
  `password` varchar(63) NOT NULL DEFAULT '' COMMENT '用户密码',
  `mobile` varchar(31) NOT NULL DEFAULT '' COMMENT '用户手机号码',
  `nickname` varchar(63) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '用户头像',
  `last_login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近一次登录时间',
  `last_login_ip` varchar(63) NOT NULL DEFAULT '' COMMENT '最近一次登录IP地址',
  `openid` varchar(127) NOT NULL DEFAULT '' COMMENT '微信登录openid',
  `session_key` varchar(127) NOT NULL DEFAULT '' COMMENT '微信登录会话session_key',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建记录时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新记录时间',
  `deleted` bit(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除 0:正常 1:删除',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username`(`username`),
  UNIQUE INDEX `mobile`(`mobile`),
  UNIQUE INDEX `openid`(`openid`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET=utf8mb4 COMMENT '用户表';

SET FOREIGN_KEY_CHECKS = 1;