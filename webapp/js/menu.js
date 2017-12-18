var json = {
	"stataus" : true,
	"messages" : "登陆成功",
	"list" : [{
				"firstMenuName" : "系统首页",
				"menus" : [{
							"url" : "../proj/home.html",
							"name" : "我的首页"
						}]
			}, {
				"firstMenuName" : "我的待办",
				"menus" : [{
							"url" : "../proj/backlog-list.html",
							"name" : "待办审批"
						}, {
							"url" : "../proj/backlogTask.html",
							"name" : "待办任务"
						}, {
							"url" : "../proj/calendar.html",
							"name" : "工作日历"
						}]
			}, {
				"firstMenuName" : "项目管理",
				"menus" : [{
							"url" : "../proj/demandInfo-list.html",
							"name" : "项目机会"
						}, {
							"url" : "../proj/bid-list.html",
							"name" : "投标管理"
						}, {
							"url" : "../proj/contract-list.html",
							"name" : "合同管理"
						}, {
							"url" : "../proj/info-list.html",
							"name" : "项目列表"
						}, {
							"url" : "../proj/task-test-list.html",
							"name" : "进度管理"
						}, {
							"url" : "../proj/knot-list.html",
							"name" : "结项管理"
						}, {
							"url" : "../proj/doc-list.html",
							"name" : "项目文档"
						}, {
							"url" : "../proj/personnel-list.html",
							"name" : "人员概览"
						}]
			}, {
				"firstMenuName" : "人事管理",
				"menus" : [{
							"url" : "../proj/evection-list.html",
							"name" : "出差申请"
						}, {
							"url" : "../proj/record-list.html",
							"name" : "出差记录"
						}, {
							"url" : "../proj/leave-list.html",
							"name" : "休假申请"
						},
						// {
						// "url":"../proj/reimburse-list.html",
						// "name":"报销申请"
						// },
						{
							"url" : "../proj/remittance-list.html",
							"name" : "回款管理"
						}, {
							"url" : "../proj/cost-list.html",
							"name" : "成本管理"
						}]
			}, {
				"firstMenuName" : "客户管理",
				"menus" : [{
							"url" : "../proj/customer-list.html",
							"name" : "业务客户"
						}, {
							"url" : "../proj/export-list.html",
							"name" : "专家管理"
						}]
			}, {
				"firstMenuName" : "查询统计",
				"menus" : [{
							"url" : "../proj/seo-list.html",
							"name" : "综合查询"
						}, {
							"url" : "../proj/remCount.html",
							"name" : "项目回款情况统计"
						}, {
							"url" : "../proj/process.html",
							"name" : "项目进度情况统计"
						}, {
							"url" : "../proj/echarts3.html",
							"name" : "项目分类情况统计"
						}]
			}, {
				"firstMenuName" : "系统管理",
				"menus" : [{
							"url" : "../proj/dept-list.html",
							"name" : "部门管理"
						}, {
							"url" : "../proj/user-list.html",
							"name" : "用户管理"
						}, {
							"url" : "../proj/role-list.html",
							"name" : "角色管理"
						}, {
							"url" : "../proj/menu-list.html",
							"name" : "菜单管理"
						}, {
							"url" : "../proj/dict-list.html",
							"name" : "数据字典"
						}, {
							"url" : "../proj/manager-list.html",
							"name" : "分管配置"
						}]
			}]
}

function renderMenuLocal() {
	var firstList = json.list;
	var menuHtml = new Array();
	var class_str = "";
	$.each(firstList, function(i, v) {
		if (v.firstMenuName == "我的工作台") {
			class_str = "home active";
		} else if (v.firstMenuName == "我的待办") {
			class_str = "pend-approval";
		} else if (v.firstMenuName == "项目管理") {
			class_str = "pro-man";
		} else if (v.firstMenuName == "人事管理") {
			class_str = "personnel-finance";
		} else if (v.firstMenuName == "客户管理") {
			class_str = "customer-man";
		} else if (v.firstMenuName == "查询统计") {
			class_str = "statistical-form";
		} else if (v.firstMenuName == "系统管理") {
			class_str = "sys-man";
		} else {
			class_str = "";
		}
		menuHtml.push('<dl class="' + class_str + ' ">');
		menuHtml.push('<dt>' + v.firstMenuName + '<i></i></dt>');

		$.each(v.menus, function(k, obj) {
					if (v.firstMenuName == "我的工作台") {
						menuHtml
								.push('<dd id="home" class="active" data-href="'
										+ obj.url + '">' + obj.name + '</dd>');
					} else {
						menuHtml.push('<dd data-href="' + obj.url + '">'
								+ obj.name + '</dd>');
					}
				});
		menuHtml.push('</dl>');
	});
	$("#menus").append(menuHtml.join(""));

	$("#content").load($("#home").data('href'));
}

function renderMenuRemote() {
	var menuHtml = new Array();

	var renderMenu = function(index, item) {
		menuHtml.push('<dl class="' + item.cls + ' ">');
		menuHtml.push('<dt id="' + item.name + '">' + item.name
				+ '<i></i></dt>');

		$.each(item.children, function(k, obj) {
					if (item.name == "主界面") {
						menuHtml
								.push('<dd id="home" class="active" data-href="'
										+ obj.url + '">' + obj.name + '</dd>');
					} else {
						menuHtml.push('<dd id=' + obj.name + ' data-href="'
								+ obj.url + '">' + obj.name + '</dd>');
					}
				});
		menuHtml.push('</dl>');
	}

	$.post('../../rs/proj/menu/systemMenuInfo', function(result) {
				menuHtml = new Array();
				var list = result.data;
				$.each(list, renderMenu);
				$("#menus").append(menuHtml.join(""));
				$("#content").load($("#home").data('href'));
				backlogTask();
			});
}
// 获得登录用户角色
function getRole() {
	var flag = '0';
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userRoles = currentUserAndRole.userRole;
	$.each(userRoles, function(i, item) {
		if (item.code == 'SYFZC') {
			var userInfo = currentUserAndRole.userInfo;
			var positionCode = userInfo.positionCode;
			if (positionCode == 103) {// 只有处长（周翔）
				flag = '1';
			}
		}
	});
	return flag;
}
// 查询代办任务和代办审批
function backlogTask() {
	var backlogTask = 0;
	var backlogActTask = 0;
	if (getRole() != '1') {// 如果角色是事业发展处,查询待办任务
		// 待办审批
		var userName = "";
		var kinds = "";
		$.get('../../rs/proj/task/personalTasks', {
					userName : userName,
					kinds : kinds
				}, function(result) {
					backlogActTask = result.recordsTotal;
					$('#我的待办').html("我的待办" + "<font color='red'>("
							+ backlogActTask + ")</font>");
					$('#待办审批').html("待办审批" + "<font color='red'>("
							+ backlogActTask + ")</font>");
					$('#待办任务').html("待办任务" + "<font color='red'>(0)</font>");
				});

	} else {
		// 待办任务
		$.get('../../rs/proj/info/findByProjectStatus', {
					projectStatus : '结项申请'
				}, function(result) {
					backlogTask = result.data.length;
					$('#待办任务').html("待办任务" + "<font color='red'>("
							+ result.data.length + ")</font>");
					// 待办审批
					var userName = "";
					var kinds = "";
					$.get('../../rs/proj/task/personalTasks', {
								userName : userName,
								kinds : kinds
							}, function(result) {
								backlogActTask = result.recordsTotal;
								$('#待办审批').html("待办审批" + "<font color='red'>("
										+ result.recordsTotal + ")</font>");
								$('#我的待办').html("我的待办" + "<font color='red'>("
										+ (backlogTask + backlogActTask)
										+ ")</font>");
							});
				});
	}
}

var jsonTest = false;
$(function() {
			if (jsonTest) {// 本地
				renderMenuLocal();
			} else {// 查询
				renderMenuRemote();
			}
		});
