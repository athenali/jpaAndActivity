<%@page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>项目管理系统</title>
<link rel="stylesheet" href="./css/bootstrap.min.css">
<link rel="stylesheet" href="./css/main.css">
<!--[if lt IE 9]>
    <script src="./js/html5shiv.min.js"></script>
    <script src="./js/respond.min.js"></script>
    <![endif]-->
</head>
<body class="login-body">
	<div class="login-box">
		<div class="logo"></div>
		<div class="input-box">
			<form id="loginForm" name="f" method="post"
				action="j_spring_security_check" class="form-horizontal">
				<div class="username-box">
					<input id="username" name="j_username" class="form-control"
						type="text" placeholder="用户名" />
				</div>
				<div class="password-box">
					<input id="password" name="j_password" class="form-control"
						type="password" placeholder="密码" />
				</div>
				<button href="index/index.html" id="loginbtn" class="btn btn-login">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
				<a id="info" class="info hide"></a>
			</form>
		</div>
	</div>
</body>
</html>