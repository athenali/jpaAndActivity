package com.jpaAndActivity.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.jpaAndActivity.base.BaseRepository;
import com.jpaAndActivity.domain.UserInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserInfoRepository
		extends BaseRepository<UserInfo, Long>, JpaSpecificationExecutor<UserInfo>, CrudRepository<UserInfo, Long> {

	UserInfo findByUsername(String userName);
	UserInfo findByDeptNameAndPositionName(String deptName,String positionName);
	UserInfo findByDeptNameAndPositionCode(String deptName,String positionCode);
	List<UserInfo>findByPositionCode(String positionCode);

	List<UserInfo> findByUsernameAndIdNot(String userName , Long id);
	@Query("select deptName from UserInfo where username = :username")
	String findDeptByUserName(@Param("username") String username);

	List<UserInfo> findByDisplayName(String displayName);

	@Query("from UserInfo where displayName = :displayName")
	UserInfo findUserByDisplayName(@Param("displayName") String displayName);
	
	List<UserInfo> findByPositionNameOrPositionName(String positionName1,String positionName2);
	UserInfo findById(Long userId);
}
