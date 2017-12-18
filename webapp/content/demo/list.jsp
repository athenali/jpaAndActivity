<%@page contentType="text/html;charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>项目管理系统</title>
<link rel="stylesheet" href="../css/bootstrap.min.css">
<link rel="stylesheet" href="../css/main.css">
<!--[if lt IE 9]>
    <script src="../js/html5shiv.min.js"></script>
    <script src="../js/respond.min.js"></script>
    <![endif]-->
</head>
<body class="expert-body">
	<header class="m-header">
		<ul class="list-inline option-area">
			<li><a href="">项目列表</a></li>
			<li><a href="">任务管理</a></li>
			<li><a href="">报销申请</a></li>
			<li><a href="">请假申请</a></li>
			<li><a href="">出差申请</a></li>
		</ul>
		<ul class="info list-unstyled pull-right">
			<li><a href="###"><span><sec:authentication
							property="name" /></span><span class="info-arrow"></span></a>
				<div class="admin-set">
					<ul class="list-unstyled">
						<li><a href="../j_spring_security_logout">退出系统</a></li>
					</ul>
				</div></li>
		</ul>
		<img class="pull-right user-img" src="../img/img06.png" />
	</header>
	<div class="m-menu">
		<div class="menus">
			<dl class="home">
				<dt>
					我的工作台<i></i>
				</dt>
				<dd>
					<a href="../index/index.html">主界面</a>
				</dd>
			</dl>
			<dl class="pro-man">
				<dt>
					项目管理<i></i>
				</dt>
				<dd>
					<a href="">新增项目机会</a>
				</dd>
				<dd>
					<a href="">项目机会跟踪</a>
				</dd>
				<dd>
					<a href="">项目列表</a>
				</dd>
				<dd>
					<a href="">投标管理</a>
				</dd>
				<dd>
					<a href="">合同管理</a>
				</dd>
				<dd>
					<a href="">任务管理</a>
				</dd>
				<dd>
					<a href="">结项管理</a>
				</dd>
				<dd>
					<a href="">项目文档</a>
				</dd>
			</dl>
			<dl class="customer-man active" style="height: 108px;">
				<dt>
					客户管理<i></i>
				</dt>
				<dd>
					<a href="">业务客户</a>
				</dd>
				<dd class="active">
					<a href="expert.html">专家管理</a>
				</dd>
			</dl>
			<dl class="pend-approval">
				<dt>
					待办审批<i></i>
				</dt>
				<dd>
					<a href="">待办审批</a>
				</dd>
			</dl>
			<dl class="statistical-form">
				<dt>
					查询统计报表<i></i>
				</dt>
				<dd>
					<a href="">综合查询</a>
				</dd>
				<dd>
					<a href="">项目回款情况统计</a>
				</dd>
				<dd>
					<a href="">项目机会情况统计</a>
				</dd>
				<dd>
					<a href="">项目分类情况统计</a>
				</dd>
			</dl>
			<dl class="personnel-finance">
				<dt>
					人事管理<i></i>
				</dt>
				<dd>
					<a href="">出差申请</a>
				</dd>
				<dd>
					<a href="">出差记录</a>
				</dd>
				<dd>
					<a href="">休假申请</a>
				</dd>
				<dd>
					<a href="">报销申请</a>
				</dd>
				<dd>
					<a href="">回款管理</a>
				</dd>
				<dd>
					<a href="">成本管理</a>
				</dd>
			</dl>
			<dl class="sys-man">
				<dt>
					系统管理<i></i>
				</dt>
				<dd>
					<a href="">部门管理</a>
				</dd>
				<dd>
					<a href="">用户管理</a>
				</dd>
				<dd>
					<a href="">角色管理</a>
				</dd>
				<dd>
					<a href="">菜单管理</a>
				</dd>
				<dd>
					<a href="">基本信息管理</a>
				</dd>
			</dl>
		</div>
	</div>
	<div class="m-content">
		<h3 class="m-crumb">
			当前位置：<span>客户管理-专家管理</span>
		</h3>
		<div class="box">
			<div class="opera-box">
				<span class="tit">姓名：</span> <input type="text" class="form-control" />
				<span class="tit">职称：</span> <input type="text" class="form-control" />
				<span class="tit">单位名称：</span> <input type="text"
					class="form-control" /> <a class="btn btn-default btn-query">查询</a>
				<div class="pull-right">
					<a class="btn btn-default btn-add" data-toggle="modal"
						data-target="#addModal">新增</a> <a
						class="btn btn-default btn-del ml-10" data-toggle="modal"
						data-target="#delModal">删除</a>
				</div>
			</div>
			<div class="table-box">
				<table class="table table-bordered">
					<tr>
						<th><input type="checkbox" /></th>
						<th>姓名</th>
						<th>性别</th>
						<th>出生日期</th>
						<th>单位名称</th>
						<th>职称</th>
						<th>联系电话</th>
						<th>邮箱</th>
						<th>地址</th>
						<th>备注</th>
						<th>操作</th>
					</tr>
					<tr>
						<td><input type="checkbox" /></td>
						<td>张三</td>
						<td>男</td>
						<td>2016-11-10</td>
						<td>xxx公司</td>
						<td>xxx经理</td>
						<td>1866666666</td>
						<td>12345345@qq.com</td>
						<td>北京市东市</td>
						<td>xxx</td>
						<td><a data-toggle="modal" data-target="#editModal">修改</a><a
							data-toggle="modal" data-target="#delModal">删除</a></td>
					</tr>
					<tr>
						<td><input type="checkbox" /></td>
						<td>张三</td>
						<td>男</td>
						<td>2016-11-10</td>
						<td>xxx公司</td>
						<td>xxx经理</td>
						<td>1866666666</td>
						<td>12345345@qq.com</td>
						<td>北京市东市</td>
						<td>xxx</td>
						<td><a data-toggle="modal" data-target="#editModal">修改</a><a
							data-toggle="modal" data-target="#delModal">删除</a></td>
					</tr>
					<tr>
						<td><input type="checkbox" /></td>
						<td>张三</td>
						<td>男</td>
						<td>2016-11-10</td>
						<td>xxx公司</td>
						<td>xxx经理</td>
						<td>1866666666</td>
						<td>12345345@qq.com</td>
						<td>北京市东市</td>
						<td>xxx</td>
						<td><a data-toggle="modal" data-target="#editModal">修改</a><a
							data-toggle="modal" data-target="#delModal">删除</a></td>
					</tr>
					<tr>
						<td><input type="checkbox" /></td>
						<td>张三</td>
						<td>男</td>
						<td>2016-11-10</td>
						<td>xxx公司</td>
						<td>xxx经理</td>
						<td>1866666666</td>
						<td>12345345@qq.com</td>
						<td>北京市东市</td>
						<td>xxx</td>
						<td><a data-toggle="modal" data-target="#editModal">修改</a><a
							data-toggle="modal" data-target="#delModal">删除</a></td>
					</tr>
					<tr>
						<td><input type="checkbox" /></td>
						<td>张三</td>
						<td>男</td>
						<td>2016-11-10</td>
						<td>xxx公司</td>
						<td>xxx经理</td>
						<td>1866666666</td>
						<td>12345345@qq.com</td>
						<td>北京市东市</td>
						<td>xxx</td>
						<td><a data-toggle="modal" data-target="#editModal">修改</a><a
							data-toggle="modal" data-target="#delModal">删除</a></td>
					</tr>
				</table>
				<div class="clearfix">
					<ul class="pagination pull-right">
						<li class="disabled"><a href="#">上一页</a></li>
						<li class="active"><a href="#">1</a></li>
						<li><a href="#">2</a></li>
						<li><a href="#">3</a></li>
						<li><a href="#">4</a></li>
						<li><a href="#">5</a></li>
						<li><span>...</span></li>
						<li><a href="#">33</a></li>
						<li><a href="#">下一页</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div id="delModal" class="modal fade del-modal" tabindex="-1"
		role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">删除信息</h4>
				</div>
				<div class="modal-body">
					<i class="del-warn"></i>确定删除吗？删除后将无法恢复！
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<div id="addModal" class="modal fade add-modal" tabindex="-1"
		role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">新增信息</h4>
				</div>
				<div class="modal-body">
					<div class="form-box">
						<span class="tit">项目名称：</span> <input type="text"
							class="form-control" />
					</div>
					<div class="form-box">
						<span class="tit">我方参与人员：</span> <input type="text"
							class="form-control" />
					</div>
					<div class="form-box">
						<span class="tit">客户方参与人员：</span> <input type="text"
							class="form-control" />
					</div>
					<div class="form-box">
						<span class="tit">沟通时间：</span> <input type="text"
							class="form-control" />
					</div>
					<div class="form-box">
						<span class="tit">沟通方式：</span> <select class="form-control">
							<option>会议</option>
							<option>现场</option>
						</select>
					</div>
					<div class="form-box">
						<span class="tit">单项选择：</span> <label><input name="sex"
							type="radio" />男</label> <label><input name="sex" type="radio" />女</label>
					</div>
					<div class="form-box">
						<span class="tit">需求描述：</span>
						<textarea rows="2" class="form-control"></textarea>
					</div>
					<div class="form-box">
						<span class="tit">状态：</span> <select class="form-control">
							<option>洽谈中</option>
							<option>等待中</option>
						</select>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">保存</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<div id="editModal" class="modal fade edit-modal" tabindex="-1"
		role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">编辑信息</h4>
				</div>
				<div class="modal-body">
					<div class="form-box">
						<span class="tit">项目名称：</span> <input type="text"
							class="form-control" value="XXX项目" />
					</div>
					<div class="form-box">
						<span class="tit">我方参与人员：</span> <input type="text"
							class="form-control" value="李XX" />
					</div>
					<div class="form-box">
						<span class="tit">客户方参与人员：</span> <input type="text"
							class="form-control" value="王XX" />
					</div>
					<div class="form-box">
						<span class="tit">沟通时间：</span> <input type="text"
							class="form-control" value="2017-02-03" />
					</div>
					<div class="form-box">
						<span class="tit">沟通方式：</span> <select class="form-control">
							<option>会议</option>
							<option>现场</option>
						</select>
					</div>
					<div class="form-box">
						<span class="tit">单项选择：</span> <label><input checked
							name="sex" type="radio" />男</label> <label><input name="sex"
							type="radio" />女</label>
					</div>
					<div class="form-box">
						<span class="tit">需求描述：</span>
						<textarea rows="2" class="form-control">保证安全</textarea>
					</div>
					<div class="form-box">
						<span class="tit">状态：</span> <select class="form-control">
							<option>洽谈中</option>
							<option>等待中</option>
						</select>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">保存</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>
	</div>
	<script src="../js/jquery.min.js"></script>
	<script src="../js/bootstrap.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/inner/expert.js"></script>
</body>
</html>
