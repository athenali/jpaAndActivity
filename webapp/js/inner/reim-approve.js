var detailTable = null;
var reimid = null;
$(function() {
			// 获取上个页面传递的id
			reimid = sessionStorage.getItem("id");
			// 初始化表格
			initTable();
			// 执行通过
			$('#approveBtn').click(doApprove);
			// 执行驳回
			$('#rejectBtn').click(doReject);
		})

function dataformat(date) {
	var data1 = new Date(date);
	var month = data1.getMonth() + 1;
	var minutes = data1.getMinutes();
	if (minutes < 10 && minutes != '0') {
		minutes = "0" + minutes;
	}
	var v = data1.getFullYear() + "-" + month + "-" + data1.getDate() + " "
			+ data1.getHours() + ":" + minutes;
	return v;
}
function initTable() {
	// 初始化申请信息
	$.post('../../proj/api/claiming/singleReimBasicInfo', {
				id : reimid
			}, function(data) {
				$('#reimFrom').setForm(data.data);
			}, "json");

	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	detailTable = $("#detailTable").dataTable({
		searching : false,
		serverSide : true,
		bSortable : true,
		ordering : false,
		paging : false,
		info : false,
		bLengthChange : false,
		iDisplayLength : 10,
		ajax : {
			url : "../../proj/api/claiming/singleReimCostDetailInfo",
			dataSrc : "data.list"
		},
		serverParams : function(param) {
			param.id = reimid;
		},
		columns : [{
					data : 'type'
				}, {
					data : 'startTime'
				}, {
					data : 'endTime'
				}, {
					data : 'costAmount'
				}, {
					data : 'descn'
				}, {
					data : 'projDocs',
					render : function(data, type, row) {
						var add = '';
						for (var key in data) {
							add += '<a href="../../projectmanage/api/file/download?path='
									+ key
									+ '&name='
									+ data[key]
									+ '">'
									+ data[key] + '</a>';
						}
						return add;
					}
				}]
	});

	approvalTable = $("#approvalTable").dataTable({
				searching : false,
				serverSide : true,
				bSortable : true,
				ordering : false,
				paging : false,
				info : false,
				bLengthChange : false,
				iDisplayLength : 10,
				ajax : {
					url : "../../proj/api/claiming/singleApprovalInfo",
					dataSrc : "data.list"
				},
				serverParams : function(param) {
					param.id = reimid;
				},
				columns : [{
							data : 'assignee'
						}, {
							data : 'name'

						}, {
							data : 'status',
							render : function(data, type, row) {
								if (data == "completed") {
									return "完成";
								}
								if (data == null) {
									return "审核中";
								}
								if (data == "withdraw") {
									return "申请人撤销申请";
								}
								if (data == "reject") {
									return "驳回申请";
								}
							}
						}, {
							data : 'approvalOpinion'
						}, {
							data : 'approvalTime',
							render : function(data, type, row) {
								return data == null ? '' : dataformat(data);
							}
						}]
			});

}

function doApprove() {
	$.post('../../proj/api/claiming/approve', {
				id : reimid,
				comment : $('.comment').val()
			}, function(result) {
				$("#content").load("../proj/backlog-list.html");
			});
}

function doReject() {
	$.post('../../proj/api/claiming/reject', {
				id : reimid,
				comment : $('.comment').val()
			}, function(result) {
				$("#content").load("../proj/backlog-list.html");
			});
}
