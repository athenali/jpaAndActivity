var table = null;

var URL_LIST = "../../rs/proj/user/userList";
var URL_SAVE = "../../rs/proj/user/save";
var URL_VIEW = '../../rs/proj/user/view';
var URL_REMOVE = '../../rs/proj/user/removeById';

$(function(){

	// 初始化表格
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
	//$('#delSelect').click(checkSelect);

	$('#roleSaveBtn').click(doSaveRole);

	// 全选
	$('#selectAll').click(selectAll);

	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#editForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#resetPasswordForm").validate({
        errorClass: 'validate-error'
    });

	
	//查询所有部门信息
	findDeptList();
	//职务
    findPosition();
    //查询角色
    findRole();
	$('#resetPasswordBtn').click(user_resetPassword_submit);
})

function findPosition(){
	var positionNameField = $('select[name=positionName]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode: 'position'	
	}, function(result) {
		positionNameField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			positionNameField.append(
				"<option value='" + item.name + "' data-id='" + item.id + "'>" + item.name + "</option>"
			);
		});
	});
}
function findRole(){
	$.post('../../rs/proj/role/rolelist', {
	}, function(result) {
		$('#roleName').html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			$('#roleName').append(
					"<option value='" + item.name + "'>" + item.name + "</option>"
			);
		});
	});
}
function initTable() {
	//配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table").dataTable({
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bLengthChange: false,
		ajax: {
			url: URL_LIST,
			dataSrc: "data.result"
		},
		serverParams: function (param) {
//			var jsonFilter = {
//			};
//			if ($.trim($('#displayName').val()) != '') {
//				jsonFilter.LIKE_displayName = $.trim($('#displayName').val());
//			}
//			if ($('#positionName').val() != '') {
//				jsonFilter.EQ_positionName = $('#positionName').val()
//			}
//			
//			if ($('#deptId').val() != '') {
//				jsonFilter.EQ_deptName = $('#deptId').val()
//			}
//			param.jsonFilter = JSON.stringify(jsonFilter);
			param.displayName = $.trim($('#displayName').val());
			param.positionName = $.trim($('#positionName').val());
			param.deptName = $.trim($('#deptId').val());
			param.roleName = $.trim($('#roleName').val());
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			},
			width: "5%"
		}, {
			data : 'displayName'
		}, {
			data : 'gender'
		}, {
			data : 'deptName'
		}, {
			data : 'positionName'
		}, {
			data : 'telephone'
		}, {
			data : 'email',
			width: "10%"
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal" data-id="' + data + '" onclick="preEdit(this);">修改</a>'
					+ '<a data-toggle="modal" data-target="#delModal" data-id="' + data + '" onclick="preDel(this);">删除</a>'
					+ '<a data-toggle="modal" data-target="#roleModal" data-id="' + data + '" onclick="preRole(this);">关联角色</a>'
					+ '<a data-toggle="modal" data-target="#resetPasswordModal" onclick="user_resetPassword(' + data + ')">重置密码</a>';
			},
			width: "22%"
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	//清空错误信息
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();

	var deptIdField = $('#addForm select[name=deptId]')
	$.post('../../rs/proj/dept/findAll',function(result) {
		deptIdField.html('<option value="">请选择</option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			deptIdField.append(
				"<option value='" + list[i].id + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
								
		}
	});
	var positionIdField = $('#addForm select[name=positionCode]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode: 'position'
	}, function(result) {
		positionIdField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			positionIdField.append(
				"<option value='" + item.value + "' data-id='" + item.id + "'>" + item.name + "</option>"
			);
		});
	});
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post(URL_SAVE, data, function(result) {
		$('#addErrorMessage').html("");
		if(result.code==200){
			$('#addModal').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage').append(result.message);
		}
	});
}

function preEdit(obj) {
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();

	var id = $(obj).data('id');
	
	var deptIdField = $('#editForm select[name=deptId]')
	$.post('../../rs/proj/dept/findAll',function(result) {
		deptIdField.html('<option value="">请选择</option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			deptIdField.append(
				"<option value='" + list[i].id + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
		}
		var positionIdField = $('#editForm select[name=positionCode]');
		$.post('../../rs/proj/dict/findByTypeCode', {
			typeCode: 'position'
		}, function(result) {
			positionIdField.html('<option value="">请选择</option>');
			var list = result.data;
			$.each(list, function(index, item) {
				positionIdField.append(
					"<option value='" + item.value + "' data-id='" + item.id + "'>" + item.name + "</option>"
				);
			});
			//回显普通数据
			$.get(URL_VIEW, {
				id: id
			}, function(result) {
				$('#editForm').setForm(result.data);
			});
		});
	});
}

function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}
	var data = $('#editForm').serialize();
	$.post(URL_SAVE, data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal').modal('hide');
			refreshList();
		}else{
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
	$.post(URL_REMOVE, {
		ids: array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function preRole(obj) {
	var id = $(obj).data('id');
	
	var rolePanelBody = $('#roleModal .panel-body')
	$.post('../../rs/proj/role/rolelist',function(result) {
		var html = '<form id="roleForm"><input type="hidden" name="userId" value="' + id + '">';
		var list = result.data;
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			html +=
				"<label>"
				+ '<input type="checkbox" name="roleId" value="' + item.id + '">&nbsp;'
				+ item.name
				+ '&nbsp;'
				+ "</label>";
		}
		html += "</form>";
		rolePanelBody.html(html);

		$.get('../../rs/proj/user/viewRole', {
			userId: id
		}, function(result) {
			var roleIds = result.data;
			for (var i = 0; i < roleIds.length; i++) {
				$('INPUT[name=roleId][value=' + roleIds[i] + ']').prop('checked', true);
			}
		});
	});
}

function doSaveRole() {
	
	var data = $('#roleForm').serialize();

	$.post('../../rs/proj/user/saveRole', data, function(data) {
		$('#roleModal').modal('hide');
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function user_resetPassword(id) {
	$('#user_resetPassword_id').val(id);
}

// 查询部门列表
function findDeptList() {
	$.post('../../rs/proj/dept/findAll', {}, function(result) {
		$('#deptId').append('<option value="">请选择</option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			$('#deptId').append(
				"<option value='" + list[i].name + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
		}
	});
}

// 重置密码
function user_resetPassword_submit() {
	if (!$('#resetPasswordForm').validate().form()) {
		return;
	}
	$.post('../../rs/proj/user/resetPassword', {
		id: $('#user_resetPassword_id').val(),
		password: $('#user_password').val(),
		confirmPassword: $('#user_confirmPassword').val()
	}, function(result) {
		if (result.code == 200) {
			alert('密码修改成功');
			$('#resetPasswordModal').modal('hide');
		} else {
			alert(result.message);
		}
	});
}
