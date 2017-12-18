var table = null;
$(function() {
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
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
						ordering : true,
						bLengthChange : false,
						order : [ [ 6, "desc" ] ],// 默认排序字段的索引
						ajax : {
							url : "../../rs/proj/customer/list",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							var jsonFilter = {};
							if ($('#compAndDeptAndName').val() != '') {
								jsonFilter.LIKE_compAndDeptAndName = $.trim($(
										'#compAndDeptAndName').val());
							}
							param.jsonFilter = JSON.stringify(jsonFilter);
						},
						columnDefs : [ {
							"orderable" : false,
							"targets" : [ 0, 7 ]
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
									data : 'name',
									render : function(data, type, row) {
										return '<a data-toggle="modal" onclick="view(this)" data-target="#viewModal" data-id="'
												+ row.id + '">' + data + '</a>';
									}
								},
								{
									data : 'company',
								},
								{
									data : 'department'
								},
								{
									data : 'post'
								},
								{
									data : 'phone'
								},
								{
									data : 'createTime'
								},
								{
									data : 'id',
									render : function(data, type, row) {
										return '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="'
												+ data
												+ '">修改</a>'
												+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="'
												+ data + '">删除</a>';
									}
								} ]
					});
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	// 清楚错误信息
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	// 查询客户类型
	var projectTypeField = $('#addForm select[name=companyType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'customerType'
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
	$.post('../../rs/proj/customer/save', data, function(result) {
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
	// 清空错误信息
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();
	var id = $(obj).data('id');
	// 查询客户类型
	var projectTypeField = $('#editForm select[name=companyType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'customerType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});

		$.get('../../rs/proj/customer/view', {
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
	$.post('../../rs/proj/customer/save', data, function(result) {
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
	// 查询客户类型
	var projectTypeField = $('#viewForm select[name=companyType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'customerType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
		// 回显普通数据
		$.get('../../rs/proj/customer/view', {
			id : id
		}, function(customer) {
			$('#viewForm').setForm(customer.data);
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
	$.post('../../rs/proj/customer/removeById', {
		ids : array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function preImport() {
	$('#customerFiles').html("");
}

function saveImport() {
	var files = $('#customerFiles').children();
	if (files.length < 1) {
		alert("请选择文件");
		return;
	}
	var data = $('#importForm').serialize();
	$.post('../../rs/proj/customer/import', data, function(result) {
		if (result.code == 200) {
			$('#importModal').modal('hide');
			refreshList();
		} else {
			alert(result.message);
			$('#importModal').modal('hide');
		}
	});
}
