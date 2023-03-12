package generator;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.VelocityTemplateEngine;

import java.util.ArrayList;
import java.util.List;

public class CodeAutoGenerator {

    public static void main(String[] args) {
        // 初始化配置
        init();
        // 开始执行生成
        autoGenerator.execute();
    }

    /**
     * 父包名
     */
    private static final String PARENT_NAME = "top.liyiwen";

    /**
     * 包名
     */
    private static final String MODULE_NAME = "book";

    /**
     * 具体要生成的表，为空表示生成全部表
     */
    private static String[] tableNames = {
            "book_category",
            "book",
            "book_comment",
            "journal",
            "like",
            "user"
    };

    /**
     * 代码生成器
     */
    private final static AutoGenerator autoGenerator = new AutoGenerator();

    /**
     * 包名配置
     */
    private static String CONTROLLER = "controller";
    private static String SERVICE = "service";
    private static String SERVICE_IMPL = "service.impl";
    private static String MAPPER = "mapper";
    private static String ENTITY = "model";
    private static String PROJECT_PATH = System.getProperty("user.dir");

    /**
     * 数据源配置
     */
    private static String DB_USERNAME = "root";
    private static String DB_PASSWORD = "Admin123";
    private static String DB_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static String DB_URL = "jdbc:mysql://127.0.0.1:3306/book?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&useSSL=false";

    /**
     * xml模板文件路径（如果模板引擎是 velocity）
     */
    private static String TEMPLATE_PATH = "/templates/mapper.xml.vm";

    /**
     * 配置
     */
    private static GlobalConfig globalConfig = new GlobalConfig();
    private static DataSourceConfig dataSourceConfig = new DataSourceConfig();
    private static PackageConfig packageConfig = new PackageConfig();
    private static InjectionConfig injectionConfig = new InjectionConfig() {
        @Override
        public void initMap() {
            // to do nothing
        }
    };;
    private static TemplateConfig templateConfig = new TemplateConfig();
    private static StrategyConfig strategyConfig = new StrategyConfig();

    /**
     * 初始化全局配置
     */
    private static void initGlobalConfig() {
        globalConfig.setAuthor("liyiwen");
        globalConfig.setOutputDir(PROJECT_PATH + "/src/main/java"); // 生成文件的输出目录
        globalConfig.setOpen(false); // 是否打开输出目录(默认值：null)
        globalConfig.setFileOverride(true); // 是否覆盖已有文件(默认值：false)
        globalConfig.setSwagger2(true);// 实体属性 Swagger2 注解
        globalConfig.setBaseResultMap(true); // 在xml中生成BaseResultMap
        globalConfig.setBaseColumnList(true); // 在xml中生成columList
//        gc.setEntityName("%sEntity"); // 设置实体类后缀
        globalConfig.setDateType(DateType.TIME_PACK); // 配置日期类型，此处为 TIME_PACK（可选）
        globalConfig.setMapperName("%sMapper"); // 自定义文件命名，注意 %s 会自动填充表实体属性！
        globalConfig.setXmlName("%sMapper");
        globalConfig.setServiceName("%sService");
        globalConfig.setServiceImplName("%sServiceImpl");
        globalConfig.setControllerName("%sController");
        autoGenerator.setGlobalConfig(globalConfig); //把全局配置添加到代码生成器主类
    }

    /**
     * 初始化数据源配置
     */
    private static void initDataSourceConfig() {
        dataSourceConfig.setUrl(DB_URL);
        dataSourceConfig.setDbType(DbType.MYSQL); // 数据库类型
        dataSourceConfig.setDriverName(DB_DRIVER); // 驱动名称
        dataSourceConfig.setUsername(DB_USERNAME); // 用户名
        dataSourceConfig.setPassword(DB_PASSWORD); // 密码
        autoGenerator.setDataSource(dataSourceConfig); //把数据源配置添加到代码生成器主类
    }

    /**
     * 初始化包配置
     */
    private static void initPackageConfig() {
        packageConfig.setParent(PARENT_NAME); // 父包名。如果为空，将下面子包名必须写全部， 否则就只需写子包名
        packageConfig.setModuleName(MODULE_NAME); // 模块名
        packageConfig.setService(SERVICE); // Service包名
        packageConfig.setEntity(ENTITY); // Entity包名
        packageConfig.setServiceImpl(SERVICE_IMPL); // ServiceImpl包名
        packageConfig.setMapper(MAPPER); // Mapper包名
        packageConfig.setController(CONTROLLER); // Contoller包名
        autoGenerator.setPackageInfo(packageConfig); // 把包配置添加到代码生成器主类
    }

    /**
     * 初始化自定义配置
     * 这里配置生成的mapper.xml文件的自定义输出路径（默认不是输出到resources文件夹下，所以需要自定义）
     */
    private static void initInjectionConfig() {
        // 自定义配置
        // 自定义输出配置：输出xml到/resources/mapper
        List<FileOutConfig> focList = new ArrayList<>();
        // 自定义配置会被优先输出
        focList.add(new FileOutConfig(TEMPLATE_PATH) {
            @Override
            public String outputFile(TableInfo t) {
                // 自定义输出文件名
                return PROJECT_PATH + "/src/main/resources/mapper/" + t.getEntityName() + "Mapper" + StringPool.DOT_XML;
            }
        });
        injectionConfig.setFileOutConfigList(focList);
        autoGenerator.setCfg(injectionConfig);
    }

    /**
     * 初始化模板配置
     */
    private static void initTemplateConfig() {
        // 配置模板
        // 配置自定义输出模板
        // 指定自定义模板路径，注意不要带上.ftl/.vm, 会根据使用的模板引擎自动识别
        templateConfig.setEntity("templates/entity.java");
        // templateConfig.setService();
        templateConfig.setController(null);
        templateConfig.setXml(null);
        autoGenerator.setTemplate(templateConfig);
    }

    /**
     * 生成策略初始化
     */
    private static void initStrategyConfig() {
        // 策略配置
        // 自定义需要填充的字段 数据库中的字段
        List<TableFill> tableFillList = new ArrayList<>();
        strategyConfig.setTableFillList(tableFillList);
        // 逻辑删除
        strategyConfig.setLogicDeleteFieldName("deleted");
        // 乐观锁
        strategyConfig.setVersionFieldName("update_time");
        // 下划线转驼峰命名
        strategyConfig.setNaming(NamingStrategy.underline_to_camel);
        strategyConfig.setColumnNaming(NamingStrategy.underline_to_camel);
        // 实体添加Lombok
        strategyConfig.setEntityLombokModel(true);
        // 使用rest风格Controller
        strategyConfig.setRestControllerStyle(true);
        strategyConfig.setControllerMappingHyphenStyle(true);
        strategyConfig.setSuperEntityClass("com.baomidou.mybatisplus.extension.activerecord.Model");
        // 去除表前缀
//        strategyConfig.setTablePrefix();
        // 指定表名（可以同时操作多个表，使用 , 隔开）（需要修改）
        strategyConfig.setInclude(tableNames);
        autoGenerator.setStrategy(strategyConfig);
        autoGenerator.setTemplateEngine(new VelocityTemplateEngine());
    }

    public static void init() {
        initGlobalConfig();
        initDataSourceConfig();
        initPackageConfig();
        initInjectionConfig();
        initTemplateConfig();
        initStrategyConfig();
    }
}