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
<title>demo input</title>
<!-- Include bootstrap CSS -->
<link rel="stylesheet"
	href="../cdn/public/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>
	<!-- Site header and navigation -->
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
					<div class="panel-heading">Demo</div>
					<ul class="nav nav-list">
						<li><a href="input2">添加2</a></li>
						<li><a href="list2">列表2</a></li>
						<li><a href="upload2">上传2</a></li>
						<li><a href="ajax2">Ajax2</a></li>
					</ul>
				</div>
			</div>
			<!-- left end -->

			<div class="col-md-10">${multipartFile}已经存到指定目录下</div>
		</div>

	</div>


	<!-- Include jQuery and bootstrap JS plugins -->
	<script src="../cdn/public/jquery/1.12.3/jquery.min.js"></script>
	<script src="../cdn/public/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</body>
</html>
