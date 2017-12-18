package com.jpaAndActivity.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.lang3.StringUtils;

public class SearchFilter {

	//LIKEIGNORE 模糊查找不区分大小写
	//LIKE 模糊查找区分大小写
	public enum Operator {
		EQ, IN, ISNULL, LIKE, GT, LT, GTE, LTE, NE,LIKEIGNORE, BETWEEN, NOTNULL
	}

	public String fieldName;
	public Object value;
	public Operator operator;

	public SearchFilter(String fieldName, Operator operator, Object value) {
		this.fieldName = fieldName;
		this.value = value;
		this.operator = operator;
	}

	public static Map<String, SearchFilter> parseJson(String json) throws Exception {
		Map<String, Object> map = new JsonMapper().fromJson(json, Map.class);
		return parseMap(map);
	}

	public static Map<String, SearchFilter> parseMap(Map<String, Object> filterParams) {
		Map<String, SearchFilter> filters = new HashMap<String, SearchFilter>();

		for (Entry<String, Object> entry : filterParams.entrySet()) {
			//String[] names = StringUtils.split(entry.getKey(), "_");
			String[] names = entry.getKey().split("_");
			Object value = entry.getValue();
			if (names.length < 2) {
				throw new IllegalArgumentException(entry.getKey() + " is not a valid search filter name");
			}
			if(names.length == 3){
				if("SHORTDATE".equals(names[2])){
					String fieldValue = (String)value;
					if(StringUtils.isNotBlank(fieldValue)){
						value = fieldValue.replace("T", "").replace(":", "").replace("-", "").subSequence(0, 8);
					}
				}
				if("DATE".equals(names[2])){
					String fieldValue = (String)value;
					if(StringUtils.isNotBlank(fieldValue)){
					//	fieldValue = fieldValue.replace("T", "").replace(":", "").replace("-", "");
						if("LTE".equals(names[0])){ 
						 	try {
						 	 Date d = DateUtils.parseDate(value.toString(), new String[]{"yyyy-MM-dd"});
						 	SimpleDateFormat YYYYMMDD = new SimpleDateFormat("yyyy-MM-dd");
						 	 value = YYYYMMDD.format(DateUtils.addDays(d, 1));
						 	} catch (ParseException e) {
								e.printStackTrace();
							} 
						}else{
							value = fieldValue+"";
						}
					}
				}
			}
			SearchFilter filter = new SearchFilter(names[1], Operator.valueOf(names[0]), value);
			if(entry.getValue() != null){
				filters.put(filter.fieldName + Identities.uuid2(), filter);
			}
		}
		return filters;
	}
}
