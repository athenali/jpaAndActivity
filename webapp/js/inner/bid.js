var table = null;
$(function() {
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

// 获取当前用户可以看哪些投标Id
function controlUser() {
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url : '../../rs/proj/bid/userControl',
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
// 是否投标
function addNeedTender(obj) {
	var str = $(obj).val();
	if (str == "1") {// 点击是
		$("#addNeedTender").attr("style", "");
	} else {//
		$("#addNeedTender").attr("style", "display:none;");
	}
}
function editNeedTender(obj) {
	var str = $(obj).val();
	if (str == "1") {// 点击是
		$("#editNeedTender").attr("style", "");
	} else {//
		$("#editNeedTender").attr("style", "display:none;");
	}
}
function viewNeedTender(obj) {
	var str = $(obj).val();
	if (str == "1") {// 点击是
		$("#viewNeedTender").attr("style", "");
	} else {//
		$("#viewNeedTender").attr("style", "display:none;");
	}
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
		order : [ [ 5, "desc" ] ],// 默认排序字段的索引
		ajax : {
			url : "../../rs/proj/bid/list",
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
			if ($('#projectName').val() != '') {
				jsonFilter.LIKE_projectName = $.trim($('#projectName').val());
			}
			if ($('#bidDate1').val() != '') {
				jsonFilter.GTE_bidDate = $('#bidDate1').val();
			}
			if ($('#bidDate2').val() != '') {
				jsonFilter.LTE_bidDate = $('#bidDate2').val();
			}
			if ($('#winBidDate1').val() != '') {
				jsonFilter.GTE_winBidDate = $('#winBidDate1').val();
			}
			if ($('#winBidDate2').val() != '') {
				jsonFilter.LTE_winBidDate = $('#winBidDate2').val();
			}

			param.jsonFilter = JSON.stringify(jsonFilter);
		},
		columnDefs : [ {
			"orderable" : false,
			"targets" : [ 0, 6]
		// 设置tab索引0，6 列不排序
		} ],
		columns : [ 
		   {
			data : 'id',
			render : function(data, type, row, meta) {
				return meta.row + 1
			}
		}, {
			data : 'projectName',
			render : function(data, type, row) {
				return getTableRow(data, '250px');
			}
		}, {
			data : 'customerName',
			render : function(data, type, row) {
				return getTableRow(data, '200px');
			}
		}, {
			data : 'bidDate'
		}, {
			data : 'deposit',
			render : function(data, type, row) {
				if (data != null) {
					return data + "元";
				} else {
					return "";
				}
			}
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
// 跳向综合页面
function toAllHtml(bidId) {
	// 查询demandInfoId
	$.get('../../rs/proj/bid/finddemandInfoIdById', {
		id : bidId
	}, function(result) {
		var demandInfoId = result.data;
		sessionStorage.setItem("demandInfoId", demandInfoId);
		sessionStorage.setItem("type", "bid");
		$("#content").load("../proj/all.html");
	});
}

function refreshList() {
	table.api().ajax.reload();
}