package com.jpaAndActivity.service;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;
@Target({ ElementType.METHOD }) /// 只作用到方法
@Retention(RetentionPolicy.RUNTIME) // 运行时有效
public @interface SystemLog {
String name();
}
