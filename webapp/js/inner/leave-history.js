var leaveId = null;
$(function() {
			// 获取上个页面传递的id
			leaveId = sessionStorage.getItem("id");
			// 初始化表格
			initTable();

			$('#returnBtn').click(returnBtn);
		})

function returnBtn() {

	$("#content").load("../proj/backlog-list.html");
}

function initTable() {
	// 初始化申请信息
	$.post('../../rs/proj/leave/findSingleLeaveInfo1', {
				id : leaveId
			}, function(result) {
				$('#leaveFrom').setForm(result.data);
			}, "json");

	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});

	table = $("#approvalTable").dataTable({
				searching : false,
				serverSide : true,
				bSortable : true,
				ordering : false,
				paging : false,
				info : false,
				bLengthChange : false,
				iDisplayLength : 10,
				ajax : {
					url : "../../rs/proj/leave/findApprovalInfo1",
					dataSrc : "data.list"
				},
				serverParams : function(param) {
					param.id = leaveId;
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
									return "领导驳回申请";
								}
							}
						}, {
							data : 'approvalOpinion'
						}, {
							data : 'approvalTime'
						}]
			});

}
