var table = null;
$(function() {
	// auto complete
	$("#addCusName").autocomplete({
		source : "../../rs/proj/customer/findList",
		minLength : 1,
		select : function(event, ui) { // ui.item.id:123456
			$('#addForm input[name=telephone]').val(ui.item.phone);
			$('#addForm input[name="customerId"]').val(ui.item.id);
		}
	});
	$("#editCusName").autocomplete({
		source : "../../rs/proj/customer/findList",
		minLength : 1,
		select : function(event, ui) { // ui.item.id:123456
			$('#editForm input[name=telephone]').val(ui.item.phone);
			$('#editForm input[name="customerId"]').val(ui.item.id);
		}
	});
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
	$('#addLink').click(preAdd);
	// 执行新增
	$('#addSaveBtn').click(doAdd);
	$('#editSaveBtn').click(doEdit);
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
	// 项目类型
	findPosition();
})

// 获取当前用户可以看那些项目机会Id
function controlUser() {
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url : '../../rs/proj/demandinfo/userControl',
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
	table = $("#table")
			.dataTable(
					{
						retrieve : true,
						searching : false,
						serverSide : true,
						ordering : true,
						bLengthChange : false,
						order : [ [ 6, "desc" ] ],// 默认排序字段的索引
						ajax : {
							url : "../../rs/proj/demandinfo/list",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							var jsonFilter = {};
							if ($('#projectName').val() != '') {
								jsonFilter.LIKE_projectName = $.trim($(
										'#projectName').val());
							}
							if ($('#customerName').val() != '') {
								jsonFilter.LIKE_customerName = $.trim($(
										'#customerName').val());
							}
							if ($('#projectType').val() != '') {
								jsonFilter.LIKE_projectType = $('#projectType')
										.val();
							}
							if ('1' == getRole()) {
								// 登录人是领导
							} else {
								var ids = [];
								ids = controlUser();
								jsonFilter.IN_id = ids;
							}
							param.jsonFilter = JSON.stringify(jsonFilter);
						},
						columnDefs : [ {
							"orderable" : false,
							"targets" : [ 0, 1, 7 ]
						} ],
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
									data : 'projectName',
									render : function(data, type, row) {
										return getTableRow(
												data,
												'150px',
												'view(this)',
												'data-id="'
														+ row.id
														+ '" data-toggle="modal" data-target="#viewModal"')
									}
								},
								{
									data : 'customerName',
									render : function(data, type, row) {
										return getTableRow(data, '150px');
									}
								},
								{
									data : 'projectType',
									render : function(data, type, row) {
										return getTableRow(data, '95px');
									}
								},
								{
									data : 'status'
								},
								{
									data : 'createTime'
								},
								{
									data : 'id',
									render : function(data, type, row) {
										if (row.status == '已签订') {
											return '<a onclick="toAllHtml(this)" data-id="'
													+ data
													+ '">签订合同</a>'
													+ '<a data-toggle="modal" data-target="#viewModal" onclick="view(this)" data-id="'
													+ data
													+ '">查看</a>'
													+ '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
													+ data
													+ '">修改</a>'
													+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
													+ data
													+ '">删除</a>'
													+ '<a data-id="'
													+ data
													+ '" onclick="toRecord(this)">机会追踪</a>';

										} else {
											return '<a data-toggle="modal" data-target="#viewModal" onclick="view(this)" data-id="'
													+ data
													+ '">查看</a>'
													+ '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
													+ data
													+ '">修改</a>'
													+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
													+ data
													+ '">删除</a>'
													+ '<a data-id="'
													+ data
													+ '" onclick="toRecord(this)">机会追踪</a>';
										}
									}
								} ]
					});
}
function toAllHtml(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("demandInfoId", id);
	sessionStorage.setItem("type", "demandInfo");
	$("#content").load("../proj/all.html");
}
function toRecord(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("demandInfoId", id);
	$("#content").load("../proj/demandRecord-list.html");
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	// 清空错误信息
	$('#addErrorMessage').html("");
	// 清空客户信息
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	$('#addForm input[name=leaderId]').val("");

	var projectTypeField = $('#addForm select[name=projectType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
	});
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/demandinfo/save', data, function(result) {
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
	var id = $(obj).data('id');
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();
	$('#addForm input[name=leaderId]').val("");

	var projectTypeField = $('#editForm select[name=projectType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
		$.get('../../rs/proj/demandinfo/view', {
			id : id
		}, function(result) {
			$('#editForm').setForm(result.data);
		});

	});

}

function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}

	var data = $('#editForm').serialize();
	$.post('../../rs/proj/demandinfo/save', data, function(result) {
		$('#editErrorMessage').html("");
		if (result.code == 200) {
			$('#editModal').modal('hide');
			refreshList();
		} else {
			$('#editErrorMessage').append(result.message);
		}
	});
}
function view(obj) {
	var id = $(obj).data('id');
	var projectTypeField = $('#viewForm select[name=projectType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
		$.get('../../rs/proj/demandinfo/view', {
			id : id
		}, function(result) {
			$('#viewForm').setForm(result.data);
		});
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
	$.post('../../rs/proj/demandinfo/removeById', {
		ids : array
	}, function(result) {
		// 删完自己，删追踪
		if (result.code == 200) {
			$('#delModal').modal('hide');
			refreshList();
		} else {
			alert('删除失败,项目机会已经关联到项目,请先删除项目');
			$('#delModal').modal('hide');
		}
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

// 查询项目类型
function findPosition() {
	var projectTypeField = $('#projectType');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
	});
}