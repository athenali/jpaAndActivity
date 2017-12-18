var detailTable = null;
var reimid = null;
$(function() {
			// 获取上个页面传递的id
			reimid = sessionStorage.getItem("id");
			// 初始化表格
			initTable();

			$('#returnBtn').click(returnBtn);
		})

function returnBtn() {

	$("#content").load("../proj/reimburse-list.html");
}

function initTable() {
	// 初始化申请信息
	$.post('../../proj/api/claiming/findSingleReimBasic', {
				id : reimid
			}, function(result) {
				$('#reimFrom').setForm(result.data);
				$("#textarea_reason").html(result.data.reason);
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
			url : "../../proj/api/claiming/findSingleReimCostDetailInfo",
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
					url : "../../proj/api/claiming/findApprovalInfo",
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
								console.log(data);
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
							data : 'approvalTime'
						}]
			});

}
