$(function() {

	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
	// 时间控件
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this
			});
		});
	});
})

function initTable() {
	$.extend(true, $.fn.dataTable.defaults, {
		"language" : {
			"url" : "../../cdn/public/datatable/Chinese.txt"
		}
	});
	proTable = $("#proTable").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : true,
		bLengthChange : false,
		order : [ [ 7, "desc" ] ],// 默认排序字段的索引
		ajax : {
			url : "../../rs/proj/demandinfo/list",
			dataSrc : "data.result"
		},
		serverParams : function(param) {
			var jsonFilter = {};
			if ($('#proName').val() != '') {
				jsonFilter.LIKE_projectName = $('#proName').val();
			}
			if ($('#cusName').val() != '') {
				jsonFilter.LIKE_customerName = $('#cusName').val();
			}
			if ($('#leader').val() != '') {
				jsonFilter.LIKE_leader = $('#leader').val();
			}
			if ($('#proType').val() != '') {
				jsonFilter.LIKE_projectType = $('#proType').val();
			}
			if ($('#status').val() != '') {
				jsonFilter.LIKE_status = $('#status').val();
			}
			if ($('#startDate').val() != '') {
				jsonFilter.GTE_createTime = $('#startDate').val();
			}
			if ($('#endDate').val() != '') {
				var endDate = getTomorrow($('#endDate').val());
				jsonFilter.LTE_createTime = endDate;
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
		},
		columnDefs : [ {
			"orderable" : false,
			"targets" : [ 0 ]
		} ],
		columns : [ {
			data : 'id',
			render : function(data, type, row, meta) {
				return meta.row + 1
			}
		}, {
			data : 'projectName'
		}, {
			data : 'projectClue',
			render : function(data, type, row) {
				return getTableRow(data, '100px');
			}
		}, {
			data : 'leader'
		}, {
			data : 'customerName'
		}, {
			data : 'projectType'
		}, {
			data : 'status'
		}, {
			data : 'createTime'
		} ]
	});
}

function refreshList() {
	proTable.api().ajax.reload();
}

function exportExcel() {
	var orderColumn = "createTime";
	var orderDir = "desc"
	// 排序的列
	var order = proTable.api().order();
	var orderNum = order[0][0];
	orderDir = order[0][1];
	switch (orderNum) {
	case 1:
		orderColumn = "projectName";
		break;
	case 2:
		orderColumn = "projectClue";
		break;
	case 3:
		orderColumn = "leader";
		break;
	case 4:
		orderColumn = "customerName";
		break;
	case 5:
		orderColumn = "projectType";
		break;
	case 6:
		orderColumn = "status";
		break;
	case 7:
		orderColumn = "createTime";
		break;
	default:
	}
	var projectName = $('#proName').val();
	var customerName = $('#cusName').val();
	var leaderName = $('#leader').val();
	var projectType = $('#proType').val();
	var status = $('#status').val();
	var startDate = $('#startDate').val();
	var endDate = getTomorrow($('#endDate').val());
	//下载
	forwardTo('../../rs/proj/seo/demandInfoExcel?projectName=' + projectName
			+ "&customerName=" + customerName + "&leaderName=" + leaderName
			+ "&projectType=" + projectType + "&status=" + status
			+ "&startDate=" + startDate + "&endDate=" + endDate +"&orderDir=" + orderDir + "&orderColumn=" +orderColumn);
}
// 获取明天日期
function getTomorrow(date) {
	var str = date.replace("-", "/").replace("-", "/");
	var time = new Date(Date.parse(str));
	var tomorrow = new Date(time.getTime() + 86400000);
	var m = tomorrow.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = tomorrow.getDate();
	d = d < 10 ? ('0' + d) : d;
	return tomorrow.getFullYear() + '-' + m + '-' + d;
}
