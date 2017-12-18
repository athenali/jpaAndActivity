<%@page contentType="text/html;charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<title>demo list2</title>
<!-- Include bootstrap CSS -->
<link rel="stylesheet"
	href="../cdn/public/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>

	<header class="top" role="header"
		style="background-color: #F8F8F8; border-bottom: 1px solid #E0E0E0; margin-bottom: 15px;">
		<div class="container-fluid">
			<a href="list" class="navbar-brand pull-left"> demo2 </a>
			<ul class="nav navbar-nav navbar-right">
				<li><a><sec:authentication property="name" /></a></li>
				<li><a href="../j_spring_security_logout">注销</a></li>
			</ul>
		</div>
	</header>

	<div class="container-fluid">
		<div class="row">
			<!-- left start -->
			<div class="col-md-2">
				<div class="panel panel-default">
					<div class="panel-heading">Demo2</div>
					<ul class="nav nav-list">
						<li><a href="input2">添加</a></li>
						<li><a href="list2">列表</a></li>
						<li><a href="upload2">上传</a></li>
						<li><a href="ajax2">Ajax</a></li>
					</ul>
				</div>
			</div>
			<!-- left end -->

			<div class="col-md-10">
				<div style="margin-bottom: 10px;">
					<div class="pull-left">
						<a href="input2" class="btn btn-default">添加</a>
					</div>

					<div class="pull-right">
						<form action="list2" method="POST" class="form-inline">
							<input type="text" name="name" value="${name1}"
								class="form-control">
							<button class="btn btn-default">搜索</button>
						</form>
					</div>

					<div class="clearfix"></div>
				</div>

				<!-- panel start -->
				<div class="panel panel-default">
					<table class="table">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							<c:forEach var="item" items="${page.result}">
								<tr>
									<td>${item.id}</td>
									<td>${item.name}</td>
									<td><a href="input2?id=${item.id}">修改2id=${item.id}</a> <a
										href="delete2?id=${item.id}">删除2</a></td>
								</tr>
							</c:forEach>
						</tbody>
					</table>

				</div>
				<!-- panel end -->

				<div>

					<div class="pull-left">共${page.totalCount}条记录 显示${page.start + 1}到${page.start + page.pageSize}条记录
					</div>

					<div class="pull-right">
						<c:if test="${page.previousEnabled}">
							<!-- 有前一页 -->
							<a class="btn btn-default pull-left"
								href="?pageNo=${page.pageNo - 1}&name=${name1}">&lt;</a>
						</c:if>
						<c:if test="${not page.previousEnabled}">
							<!-- 没有前一页 -->
							<a class="btn btn-default pull-left disabled">&lt;</a>
						</c:if>
						<select class="form-control pull-left" style="width: auto;"
							onchange="location.href='list2?pageNo='+this.value+'&name='+'${name1 }'">
							<c:forEach begin="1" end="${page.pageCount}" var="item">
								<option value="${item}" ${page.pageNo == item ? 'selected' : ''}>${item}...</option>
							</c:forEach>
						</select>
						<c:if test="${page.nextEnabled}">
							<!-- 有后一页 -->
							<a class="btn btn-default pull-left"
								href="?pageNo=${page.pageNo + 1}&name=${name1}">&gt;</a>
						</c:if>
						<c:if test="${not page.nextEnabled}">
							<!-- 没有后一页 -->
							<a class="btn btn-default pull-left disabled">&gt;</a>
						</c:if>
					</div>

				</div>

			</div>
		</div>

	</div>

	<script src="../cdn/public/jquery/1.12.3/jquery.min.js"></script>
	<script src="../cdn/public/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</body>
</html>
