var table = null;
$(function() {
	// 获取session中的demandInfoId
	DemandInfoId = sessionStorage.getItem("demandInfoId");
	// 时间控件
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this
			});
		});
	});
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
})

// 获取当前用户可以看哪些合同Id
function controlUser() {
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url : '../../rs/proj/contract/userControl',
		data : {
			userId : userId
		},
		async : false,
		dataType : "json",
		success : function(data) {
			ids = data.data;
		}
	});
	if (ids.length < 1)
		ids.push(-1);
	return ids;
}

// 获得登录用户角色
function getRole() {
	var flag = '0';
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userRoles = currentUserAndRole.userRole;
	$.each(userRoles, function(i, item) {
		if (item.code == 'SYFZC' || item.code == 'YLD') {
			flag = 1;
		}
	});
	return flag;
}

function initTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language" : {
			"url" : "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : true,
		bLengthChange : false,
		order : [ [ 7, "desc" ] ],// 默认排序字段的索引
		ajax : {
			url : "../../rs/proj/contract/list",
			dataSrc : "data.result"
		},
		serverParams : function(param) {
			var jsonFilter = {};
			if ('1' == getRole()) {
				// 登录人是领导
			} else {
				var ids = [];
				ids = controlUser();
				jsonFilter.IN_id = ids;
			}
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $.trim($('#name').val());
			}
			if ($('#registerDate1').val() != '') {
				jsonFilter.GTE_registerDate = $('#registerDate1').val();
			}
			if ($('#registerDate2').val() != '') {
				jsonFilter.LTE_registerDate = $('#registerDate2').val();
			}
			if ($('#resultDateZg1').val() != '') {
				jsonFilter.GTE_resultDateZg = $('#resultDateZg1').val();
			}
			if ($('#resultDateZg2').val() != '') {
				jsonFilter.LTE_resultDateZg = $('#resultDateZg2').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
		},
		columnDefs : [ {
			"orderable" : false,
			"targets" : [ 0, 8 ]
		} ],
		columns : [ {
			data : 'id',
			render : function(data, type, row, meta) {
				return meta.row + 1
			}
		}, {
			data : 'contractNumber',
			render : function(data, type, row) {
				return getTableRow(data, '200px');
			}
		}, {
			data : 'name',
			render : function(data, type, row) {
				return getTableRow(data, '150px');
			}
		}, {
			data : 'payDateOne'
		}, {
			data : 'payDateTwo'
		}, {
			data : 'payDateThree'
		}, {
			data : 'registerDate'
		}, {
			data : 'createTime'
		}, {
			data : 'id',
			render : function(data, type, row) {
				return '<a  onclick="toAllHtml(' + data + ')">查看</a>';
			}
		} ]
	});
}

function toAllHtml(id) {
	// 查询demandInfoId
	$.get('../../rs/proj/contract/finddemandInfoIdById', {
		id : id
	}, function(result) {
		var demandInfoId = result.data;
		sessionStorage.setItem("demandInfoId", demandInfoId);
		sessionStorage.setItem("type", "contract");
		$("#content").load("../proj/all.html");
	});
}

function refreshList() {
	table.api().ajax.reload();
}