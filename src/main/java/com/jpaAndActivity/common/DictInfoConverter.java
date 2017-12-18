package com.jpaAndActivity.common;

/**
 * @Description TODO 数据字典枚举类
 * @author Felix.ma
 * @date 2017年10月16日 上午10:12:42
 */
public enum DictInfoConverter {

	/** taskTimeoverReason */
	超时原因("taskTimeoverReason"),
	/** reimType */
	费用类型("reimType"),
	/** costType */
	报销类型("costType"),
	/** vehicle */
	交通工具("vehicle"),
	/** leaveType */
	休假类型("leaveType"),
	/** projStatus */
	项目状态("projStatus"),
	/** projectType */
	项目类型("projectType");

	private String type;

	private DictInfoConverter(String name) {
		this.type = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return type;
	}

}
