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

/**
 * MenuInfo .
 *
 * @author Lingo
 */
@Entity
@Table(name="MENU_INFO"
)
public class MenuInfo  implements java.io.Serializable {

    private static final long serialVersionUID = 0L;

    /** null. */
    private Long id;
    /** null. */
    private String code;
    /** null. */
    private String name;
    /** null. */
    private String url;
	/** cls. */
	private String cls;
    /** null. */
    private Long parentId;
    /** null. */
    private Integer priority;
    /** null. */
    private String descn;
    /** null. */
    private Date createTime;
    /** . */
    private Set<RoleInfo> roleInfos = new HashSet<RoleInfo>(0);

    public MenuInfo() {
    }

	
    public MenuInfo(Long id) {
        this.id = id;
    }
    public MenuInfo(Long id, String code, String name, String url, Long parentId, Integer priority, String descn, Date createTime, Set<RoleInfo> roleInfos) {
       this.id = id;
       this.code = code;
       this.name = name;
       this.url = url;
       this.parentId = parentId;
       this.priority = priority;
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

    
    @Column(name="CODE", length=50)
    public String getCode() {
        return this.code;
    }
    /** @param code null. */
    public void setCode(String code) {
        this.code = code;
    }
    /** @return null. */

    
    @Column(name="NAME", length=50)
    public String getName() {
        return this.name;
    }
    /** @param name null. */
    public void setName(String name) {
        this.name = name;
    }
    /** @return null. */

    
    @Column(name="URL", length=200)
    public String getUrl() {
        return this.url;
    }
    /** @param url null. */
    public void setUrl(String url) {
        this.url = url;
    }

	/** @return null. */
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}

    /** @return null. */

    
    @Column(name="PARENT_ID")
    public Long getParentId() {
        return this.parentId;
    }
    /** @param parentId null. */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
    /** @return null. */

    
    @Column(name="PRIORITY")
    public Integer getPriority() {
        return this.priority;
    }
    /** @param priority null. */
    public void setPriority(Integer priority) {
        this.priority = priority;
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
    @JoinTable(name="ROLE_MENU", joinColumns = { 
        @JoinColumn(name="MENU_ID", nullable=false, updatable=false) }, inverseJoinColumns = { 
        @JoinColumn(name="ROLE_ID", nullable=false, updatable=false) })
    public Set<RoleInfo> getRoleInfos() {
        return this.roleInfos;
    }
    /** @param roleInfos . */
    public void setRoleInfos(Set<RoleInfo> roleInfos) {
        this.roleInfos = roleInfos;
    }




}



