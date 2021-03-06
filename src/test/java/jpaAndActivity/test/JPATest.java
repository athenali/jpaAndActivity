package jpaAndActivity.test;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.jpaAndActivity.common.DynamicSpecifications;
import com.jpaAndActivity.common.PageSupport;
import com.jpaAndActivity.common.SearchFilter;
import com.jpaAndActivity.dao.UserInfoRepository;
import com.jpaAndActivity.domain.MenuInfo;
import com.jpaAndActivity.domain.UserInfo;
import com.jpaAndActivity.dto.UserInfoDTO;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring.xml", "classpath:spring-mvc.xml" })
public class JPATest {
	@Resource
	private UserInfoRepository userInfoRepository;
	@Test
	public void test() {
		UserInfo userInfo=new UserInfo();
		userInfo.setId(3l);
		userInfo.setCreateTime(new Date());
		userInfo.setDeptId(1l);
		userInfo.setUsername("33");
		userInfo.setDescn("001");
		userInfoRepository.save(userInfo);
	}
	//sql映射dto,实现遍历查询
	@Test
	public void findListBySql() {
     String sql="select USERNAME as userName,DEPT_NAME  as deptName ,id from user_info ";
        List<UserInfoDTO> findListBySql = userInfoRepository.findListBySql(UserInfoDTO.class, 0, sql, null);
        for (UserInfoDTO userInfoDTO : findListBySql) {
			System.out.println("++++"+userInfoDTO.getUserName());
		}
	}
	/**
	 * sql实现分页查询，可以进行多表关联
	 */
	@SuppressWarnings("unchecked")
	@Test
	public void findSuportBySql() {
		String sql="select USERNAME as userName,DEPT_NAME  as deptName ,id from user_info ";
		PageSupport<UserInfoDTO> findPageSupportBySQL = userInfoRepository.findPageSupportBySQL(UserInfoDTO.class, 0, sql, null, 1, 2);
          List<UserInfoDTO> result = (List<UserInfoDTO>) findPageSupportBySQL.getResult();
		for (UserInfoDTO userInfoDTO : result) {
			System.out.println(userInfoDTO.getUserName()+"++++++++++"+userInfoDTO.getDeptName());
		}
	}
	/**
	 * 将查询条件封装到filterParams中，进行分页查询
	 * @param pageable
	 * @param filterParams
	 */
	@Test
	public void pageQuery() {
		Pageable pageable=new PageRequest(0, 10);
	   Map<String,SearchFilter>filterParams=new HashMap<>();
		Specification<UserInfo> specification = DynamicSpecifications.bySearchFilter(filterParams.values(), UserInfo.class);
		Page<UserInfo> findAll = userInfoRepository.findAll(specification, pageable);
	    List<UserInfo> content = findAll.getContent();
	    for (UserInfo userInfo : content) {
			System.out.println(userInfo.getUsername());
		}
	}
	
}
