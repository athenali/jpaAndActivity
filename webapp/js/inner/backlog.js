var table = null;

var personalTaskType = 'todo';

$(function() {
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
	// 待办已办
	$('#type-todo').click(function() {
		personalTaskType = 'todo';
		refreshList();
	});
	$('#type-completed').click(function() {
		personalTaskType = 'completed';
		refreshList();
	});
})

function initTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language" : {
			"url" : "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table")
			.dataTable(
					{
						retrieve : true,
						searching : false,
						serverSide : true,
						ordering : false,
						bLengthChange : false,
						ajax : {
							url : "../../rs/proj/task/personalTasks",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							param.type = personalTaskType;
						    var userName=$('#userName').val();
						    var kinds=$('#kinds').val();
							if(null!=userName){
								param.userName=userName;
							}
							if(null!=kinds){
								param.kinds=kinds;
							}
						},
						columns : [
								{
									data : 'id',
									render : function(data, type, row) {
										return '<input type="checkbox" value="'
												+ data
												+ '" class="selectedItem">'
									}
								},
								{
									data : 'id',
									render : function(data, type, row, meta) {
										return meta.row + 1
									}
								},
								{
									data : 'name'
								},
								{
									data : 'category'
								},
								{
									data : 'initiator'
								},
								{
									data : 'createTime',
									render : function(data) {
										return parseDateTime(data);
									}
								},
								{
									data : 'id',
									render : function(data, type, row) {
										if (personalTaskType == 'todo') {
											return '<a data-toggle="modal" onclick="findSelect(this)"   data-id="'
													+ data
													+ '" data-catalog="'
													+ row.name + '">处理</a>';
										} else {
											return '<a data-toggle="modal" onclick="viewHistoryForm(this)"   data-id="'
													+ data
													+ '" data-catalog="'
													+ row.name + '">详情</a>';
										}
									}
								} ]
					});
}

function findSelect(obj) {
	var id = $(obj).data('id');
	var catalog = $(obj).data('catalog');
	sessionStorage.setItem("id", id);
	if (catalog == '休假申请') {
		$("#content").load("../proj/leave-approve.html");
	} else if (catalog == '结项申请') {
		$('#content').load('../proj/knot-approve.html');
	} else if (catalog == '报销申请') {
		$("#content").load("../proj/reim-approve.html");
	}else if (catalog == '特殊合同申请') {
		$("#content").load("../proj/contract-approve.html");
	}else {
		$("#content").load("../proj/backlogFind.html");
	}
}

function viewHistoryForm(obj) {
	var id = $(obj).data('id');
	var catalog = $(obj).data('catalog');

	sessionStorage.setItem("id", id);
	if (catalog == '休假申请') {
		$("#content").load("../proj/leave-history.html");
	} else if (catalog == '结项申请') {
		$('#content').load('../proj/knot-history.html');
	} else if (catalog == '出差申请') {
		$('#content').load('../proj/evection-history.html');
	} else if (catalog == '报销申请') {
		$('#content').load('../proj/reim-find2.html');
	}else if (catalog == '特殊合同申请') {
		$("#content").load("../proj/contract-history.html");
	}
}

function refreshList() {
	table.api().ajax.reload();
}

function parseDate(timestamp) {
	var date = new Date(timestamp);
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
			+ date.getDate();
}

function parseDateTime(timestamp) {
	var date = new Date(timestamp);
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-'
			+ date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
			+ ':' + date.getSeconds();
}
