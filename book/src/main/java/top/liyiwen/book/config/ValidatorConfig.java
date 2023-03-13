package top.liyiwen.book.config;

import org.hibernate.validator.HibernateValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 * hibernate-validator 配置
 */
@Configuration
public class ValidatorConfig {

    /**
     * 配置快速失败模式，遇到一个不匹配直接返回，而不是扫描所有是否匹配：
     * 1. 普通模式（默认模式）：会校验完所有的属性，然后返回所有的验证失败信息
     * 2. 快速失败模式：只要有一个验证失败，则返回
     */
    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                // 快速失败模式
                .failFast(true)
                .buildValidatorFactory();
        return validatorFactory.getValidator();
    }

    /**
     * 设置 Validator 模式为快速失败返回
     */
    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        MethodValidationPostProcessor postProcessor = new MethodValidationPostProcessor();
        postProcessor.setValidator(validator());
        return postProcessor;
    }

}