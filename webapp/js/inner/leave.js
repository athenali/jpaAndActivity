var table = null;
var currentUserId = null;
$(function() {
			currentUserId = sessionStorage.getItem("currentUserId");
			// 日期控件
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
			// 新增
			$('#addLeave').click(addLeave);
			// 新增清理
			$('#addLink').click(preAdd);
			// 执行新增
			$('#addSaveBtn').click(doAdd);
			// 执行修改
			$('#editSaveBtn').click(doEdit);
			// 执行删除
			$('#delBtn').click(doDel);
			// 批量删除确认
			$('#delSelect').click(checkSelect);
			// 全选
			$('#selectAll').click(selectAll);
			// 校验表单
			$("FORM#addForm").validate({
						errorClass : 'validate-error'
					});
			$("FORM#editForm").validate({
						errorClass : 'validate-error'
					});
			// 提交
			$('#startBtn').click(doStartBtn);
			// 撤销
			$('#withdrawBtn').click(doWithdrawBtn);
		})

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
		order : [[6, "desc"]],// 默认排序字段的索引
		ajax : {
			url : "../../rs/proj/leave/list",
			dataSrc : "data.result"
		},
		serverParams : function(param) {
			var jsonFilter = {};
			jsonFilter.EQ_userId = currentUserId;
			if ($('#leave_type').val() != '') {
				jsonFilter.EQ_type = $('#leave_type').val();
			}
			if ($('#leave_startDate').val() != '') {
				jsonFilter.GT_startDate = $('#leave_startDate').val();
			}
			if ($('#leave_endDate').val() != '') {
				jsonFilter.LT_endDate = $('#leave_endDate').val();
			}

			if ($('#leave_status').val() != '') {
				jsonFilter.EQ_status = $('#leave_status').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
		},
		columnDefs : [{
			"orderable" : false,
			"targets" : [0, 8]
				// 设置tab索引0，11 列不排序
			}],
		columns : [{
			data : 'id',
			render : function(data, type, row) {
				return '<input type="checkbox" value="' + data
						+ '" class="selectedItem">'
			}
		}, {
			data : 'reason'
		}, {
			data : 'type'
		}, {
			data : 'startDate'
		}, {
			data : 'endDate'
		}, {
			data : 'day'
		}, {
			data : 'createTime'
		}, {
			data : 'status',
			render : function(data) {
				if (data == 'draft') {
					return '草稿';
				}
				if (data == 'inProgress') {
					return '审批中';
				}
				if (data == "finish") {
					return "审核完成";
				}
				if (data == "withdraw") {
					return "撤退";
				}
				if (data == "reject") {
					return "驳回";
				}
			}
		}, {
			data : 'id',
			render : function(data, type, row) {
				if (row.status == 'draft' || row.status == 'withdraw') {
					return '<a data-toggle="modal" data-target="#editModal" class="editLink" data-id="'
							+ data
							+ '" onclick="preEdit(this);">修改</a>'
							+ '<a data-toggle="modal" data-target="#delModal" class="delLink" data-id="'
							+ data
							+ '" onclick="preDel(this);">删除</a>'
							+ '<a data-toggle="modal" data-target="#startModal" class="startLink" data-id="'
							+ data + '" onclick="preStart(this);">提交</a>';
				} else if (row.status == 'inProgress') {
					return '<a data-toggle="modal" data-target="#withdrawModal" onclick="preWithdraw(this)"  data-id="'
							+ data
							+ '">撤退</a>'
							+ '<a data-toggle="modal"  onclick="findSelect(this)"  data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal" onclick="preGraph(this)" data-id="'
							+ data + '">查看流程图</a>';
				} else if (row.status == 'finish') {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal"  onclick="preComplete(this)"  data-id="'
							+ data + '">查看流程图</a>';
				} else if (row.status == 'reject') {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data
							+ '">查看</a>'
							+ '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
							+ data
							+ '">修改</a>'
							+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
							+ data
							+ '">删除</a>'
							+ '<a data-toggle="modal" data-target="#startModal" onclick="preStart(this)" data-id="'
							+ data + '">提交</a>'
				} else {
					return '<a data-toggle="modal" onclick="findSelect(this)" data-id="'
							+ data + '">查看</a>'
				}
			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

// TODO
function findSelect(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/leave-find.html");
}
// TODO 任务执行中查看流程图
function preGraph(obj) {
	var leaveId = $(obj).data('id');
	sessionStorage.setItem("leaveId", leaveId);
	$("#content").load("../proj/leave-graph.html");

}
// TODO 任务执行完成后查看流程图
function preComplete(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/leave-complete.html");
}

// 新增页面跳转
function addLeave() {
	location.href = 'leave-input.html';
}

function findByCode() {
	$.post('../../rs/proj/leave/findByCode', {}, function(data) {
				var html = new Array();
				$(data.data).each(function(index, obj) {
							html.push("<option value=")
							html.push(obj.value);
							html.push(">");
							html.push(obj.name);
							html.push("</option>)");
						});
				$("#leaveType").html(html.join(""));
			});
}

function preAdd() {
	// 清空错误信息
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();

	findByCode();
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/leave/saveDraft', data, function(result) {
				$('#addErrorMessage').html("");
				if (result.code == 200) {
					$('#addModal').modal('hide');
					refreshList();
				} else {
					$('#addErrorMessage').append(result.message);
				}
			});

}

function preEdit(obj) {
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();

	var id = $(obj).data('id');
	$.get('../../rs/proj/leave/view', {
				id : id
			}, function(result) {
				$.post('../../rs/proj/leave/findByCode', {}, function(data) {
							var html = new Array();
							$.each(data.data, function(index, obj) {
										html.push("<option value=")
										html.push(obj.value);
										html.push(">");
										html.push(obj.name);
										html.push("</option>)");
										$("#editLeaveType").html(html.join(""));
									});
							$('#editForm').setForm(result.data);
						});
			});

}

function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}
	var id = $('input[name=id]').val();
	var data = $('#editForm').serialize();
	$.post('../../rs/proj/leave/save?id=' + id, data, function(result) {
				$('#editErrorMessage').html("");
				if (result.code == 200) {
					$('#editModal').modal('hide');
					refreshList();
				} else {
					$('#editErrorMessage').append(result.message);
				}
			});
}

function preDel(obj) {
	var id = $(obj).data('id');
	$('input.selectedItem').prop('checked', false);
	$('input[value=' + id + '].selectedItem').prop('checked', true);
}

function checkSelect() {
	if ($('input.selectedItem:checked').length == 0) {
		$('#alertModal').modal('show');
	} else {
		$('#delModal').modal('show');
	}
}

function doDel() {
	var array = [];
	$.each($('input.selectedItem:checked'), function() {
				array.push(this.value);
			});
	$.post('../../rs/proj/leave/delete', {
				ids : array
			}, function(result) {
				if (result.data.length > 0) {
					var html = new Array();
					$(result.data).each(function(index, obj) {
								html.push('<p style="margin-left: 126px;">')
								html.push(obj);
								html.push('<p/>')
							});
					$("#tbody").html(html.join(""));
					$('#delModal').modal('hide');
					$('#errorModal').modal('show');
				} else {
					$('#delModal').modal('hide');
				}
				refreshList();
			});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function preStart(obj) {
	$('#startModal').data('id', $(obj).data('id'));
}

function doStartBtn() {
	$.post('../../rs/proj/leave/startProcess', {
				id : $('#startModal').data('id')
			}, function(data) {
				$('#startModal').modal('hide');
				refreshList();
			});
}

function preWithdraw(obj) {
	$('#withdrawModal').data('id', $(obj).data('id'));
}
function doWithdrawBtn() {
	$.post('../../rs/proj/leave/withdraw', {
				id : $('#withdrawModal').data('id')
			}, function(data) {
				var html = new Array();
				if (data.data == "流程不能撤销") {
					html.push('<p style="margin-left: 155px;">')
					html.push(data.data);
					html.push('<p/>')
					$("#tbody").html(html.join(""));
					$('#withdrawModal').modal('hide');
					$('#errorModal').modal('show');
				} else {
					$('#withdrawModal').modal('hide');
				}
				refreshList();
			});
}
