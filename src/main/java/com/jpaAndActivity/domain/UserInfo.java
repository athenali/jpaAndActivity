package com.jpaAndActivity.domain;


// Generated by Hibernate Tools


import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * UserInfo .
 *
 * @author Lingo
 */
@Entity
@Table(name="USER_INFO"
)
@JsonIgnoreProperties({"handler","hibernateLazyInitiaizer"})
public class UserInfo  implements java.io.Serializable {

    private static final long serialVersionUID = 0L;

    /** null. */
    private Long id;
    /** null. */
    private Long deptId;
    /** null. */
    private String deptName;
    /** null. */
    private String username;
    /** null. */
    private String password;
    /** null. */
    private String displayName;
    /** null. */
    private String nation;
    /** null. */
    private String gender;
    /** null. */
    private Date birthday;
    /** null. */
    private String school;
    /** null. */
    private Date workTime;
    /** null. */
    private String telephone;
    /** null. */
    private String email;
    /** null. */
    private String positionCode;
    /** null. */
    private String positionName;
    /** null. */
    private String isAsistant;//是否院长助理
    /** null. */
    private String specialty;
    /** null. */
    private String descn;
    /** null. */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+08:00")
    private Date createTime;
    /** . */
    private Set<RoleInfo> roleInfos = new HashSet<RoleInfo>(0);

    public UserInfo() {
    }

	
    public UserInfo(Long id) {
        this.id = id;
    }
    public UserInfo(Long id, Long deptId, String deptName, String username, String password, String displayName, String nation, String gender, Date birthday, String school, Date workTime, String telephone, String email, String positionCode, String positionName, String isAsistant, String specialty, String descn, Date createTime, Set<RoleInfo> roleInfos) {
       this.id = id;
       this.deptId = deptId;
       this.deptName = deptName;
       this.username = username;
       this.password = password;
       this.displayName = displayName;
       this.nation = nation;
       this.gender = gender;
       this.birthday = birthday;
       this.school = school;
       this.workTime = workTime;
       this.telephone = telephone;
       this.email = email;
       this.positionCode = positionCode;
       this.positionName = positionName;
       this.isAsistant = isAsistant;
       this.specialty = specialty;
       this.descn = descn;
       this.createTime = createTime;
       this.roleInfos = roleInfos;
    }
   
    /** @return null. */
     @Id 

    
    @Column(name="ID", unique=true, nullable=false)
    public Long getId() {
        return this.id;
    }
    /** @param id null. */
    public void setId(Long id) {
        this.id = id;
    }
    /** @return null. */

    
    @Column(name="DEPT_ID")
    public Long getDeptId() {
        return this.deptId;
    }
    /** @param deptId null. */
    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }
    /** @return null. */

    
    @Column(name="DEPT_NAME", length=50)
    public String getDeptName() {
        return this.deptName;
    }
    /** @param deptName null. */
    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }
    /** @return null. */

    
    @Column(name="USERNAME", length=50)
    public String getUsername() {
        return this.username;
    }
    /** @param username null. */
    public void setUsername(String username) {
        this.username = username;
    }
    /** @return null. */

    
    @Column(name="PASSWORD", length=50)
    public String getPassword() {
        return this.password;
    }
    /** @param password null. */
    public void setPassword(String password) {
        this.password = password;
    }
    /** @return null. */

    
    @Column(name="DISPLAY_NAME", length=50)
    public String getDisplayName() {
        return this.displayName;
    }
    /** @param displayName null. */
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    /** @return null. */

    
    @Column(name="NATION", length=50)
    public String getNation() {
        return this.nation;
    }
    /** @param nation null. */
    public void setNation(String nation) {
        this.nation = nation;
    }
    /** @return null. */

    
    @Column(name="GENDER", length=50)
    public String getGender() {
        return this.gender;
    }
    /** @param gender null. */
    public void setGender(String gender) {
        this.gender = gender;
    }
    /** @return null. */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="BIRTHDAY", length=26)
    public Date getBirthday() {
        return this.birthday;
    }
    /** @param birthday null. */
    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }
    /** @return null. */

    
    @Column(name="SCHOOL", length=50)
    public String getSchool() {
        return this.school;
    }
    /** @param school null. */
    public void setSchool(String school) {
        this.school = school;
    }
    /** @return null. */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="WORK_TIME", length=26)
    public Date getWorkTime() {
        return this.workTime;
    }
    /** @param workTime null. */
    public void setWorkTime(Date workTime) {
        this.workTime = workTime;
    }
    /** @return null. */

    
    @Column(name="TELEPHONE", length=20)
    public String getTelephone() {
        return this.telephone;
    }
    /** @param telephone null. */
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    /** @return null. */

    
    @Column(name="EMAIL", length=50)
    public String getEmail() {
        return this.email;
    }
    /** @param email null. */
    public void setEmail(String email) {
        this.email = email;
    }
    /** @return null. */

    
    @Column(name="POSITION_CODE", length=50)
    public String getPositionCode() {
        return this.positionCode;
    }
    /** @param positionCode null. */
    public void setPositionCode(String positionCode) {
        this.positionCode = positionCode;
    }
    /** @return null. */

    
    @Column(name="POSITION_NAME", length=50)
    public String getPositionName() {
        return this.positionName;
    }
    /** @param positionName null. */
    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }
    /** @return null. */

    
    @Column(name="IS_ASISTANT")
    public String getIsAsistant() {
        return this.isAsistant;
    }
    /** @param IS_ASISTANT null. */
    public void setIsAsistant(String isAsistant) {
        this.isAsistant = isAsistant;
    }
    /** @return null. */

    
    @Column(name="SPECIALTY", length=200)
    public String getSpecialty() {
        return this.specialty;
    }
    /** @param specialty null. */
    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
    /** @return null. */

    
    @Column(name="DESCN", length=200)
    public String getDescn() {
        return this.descn;
    }
    /** @param descn null. */
    public void setDescn(String descn) {
        this.descn = descn;
    }
    /** @return null. */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="CREATE_TIME", length=26)
    public Date getCreateTime() {
        return this.createTime;
    }
    /** @param createTime null. */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
    /** @return . */

@ManyToMany(fetch=FetchType.LAZY)
    @JoinTable(name="USER_ROLE", joinColumns = { 
        @JoinColumn(name="USER_ID", nullable=false, updatable=false) }, inverseJoinColumns = { 
        @JoinColumn(name="ROLE_ID", nullable=false, updatable=false) })
    public Set<RoleInfo> getRoleInfos() {
        return this.roleInfos;
    }
    /** @param roleInfos . */
    public void setRoleInfos(Set<RoleInfo> roleInfos) {
        this.roleInfos = roleInfos;
    }




}


