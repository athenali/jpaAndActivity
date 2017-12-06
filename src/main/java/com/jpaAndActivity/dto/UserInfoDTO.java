package com.jpaAndActivity.dto;

import java.math.BigDecimal;

public class UserInfoDTO {
private  String userName;
private String deptName;
private BigDecimal id;
private  BigDecimal deptId;

public UserInfoDTO(String userName, String deptName, BigDecimal id) {
	super();
	this.userName = userName;
	this.deptName = deptName;
	this.id = id;
}
public String getUserName() {
	return userName;
}
public void setUserName(String userName) {
	this.userName = userName;
}
public String getDeptName() {
	return deptName;
}
public void setDeptName(String deptName) {
	this.deptName = deptName;
}
public BigDecimal getId() {
	return id;
}
public void setId(BigDecimal id) {
	this.id = id;
}
public BigDecimal getDeptId() {
	return deptId;
}
public void setDeptId(BigDecimal deptId) {
	this.deptId = deptId;
}

}
