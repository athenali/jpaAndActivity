package com.jpaAndActivity.common;

public interface IdGenerator {
    Long generateId();

    Long generateId(String name);

    Long generateId(Class<?> clz);
}
