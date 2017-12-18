var table = null;

var URL_LIST = "../../rs/proj/manager/list";
var URL_SAVE = "../../rs/proj/manager/save";
var URL_VIEW = '../../rs/proj/manager/view';
var URL_REMOVE = '../../rs/proj/manager/removeById';

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

	// 全选
	$('#selectAll').click(selectAll);

	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#editForm").validate({
        errorClass: 'validate-error'
    });

	//查询所有部门信息
	findDeptList();

	$( "#manager_displayName" ).autocomplete({
		source: "../../rs/proj/user/findList",  
		minLength: 1,
		select: function( event, ui ) {
		}
	});

	$( "#add_displayName" ).autocomplete({
		source: "../../rs/proj/user/findList",  
		minLength: 0,
		select: function( event, ui ) {
			$("#addForm input[name=username]").val(ui.item.username);
		}
	});

	$( "#edit_displayName" ).autocomplete({
		source: "../../rs/proj/user/findList",  
		minLength: 0,
		select: function( event, ui ) {
			$("#editForm input[name=username]").val(ui.item.username);
		}
	});
})

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
			var jsonFilter = {
			};
			if ($('#manager_displayName').val() != '') {
				jsonFilter.LIKE_displayName = $.trim($('#manager_displayName').val());
			}
			
			if ($('#deptId').val() != '') {
				jsonFilter.EQ_deptName = $('#deptId').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
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
			data : 'deptName'
		}, {
			data : 'descn'
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal" data-id="' + data + '" onclick="preEdit(this);">修改</a>'
					+ '<a data-toggle="modal" data-target="#delModal" data-id="' + data + '" onclick="preDel(this);">删除</a>';
			}
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
		deptIdField.html('<option value=""></option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			deptIdField.append(
				"<option value='" + list[i].id + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
								
		}
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
		deptIdField.html('<option value=""></option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			deptIdField.append(
				"<option value='" + list[i].id + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
		}

		$.get(URL_VIEW, {
			id: id
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

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

// 查询部门列表
function findDeptList() {
	$.post('../../rs/proj/dept/findAll', {}, function(result) {
		$('#deptId').append('<option value=""></option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			$('#deptId').append(
				"<option value='" + list[i].name + "' data-did='" + list[i].id + "'>" + list[i].name + "</option>"
			);
		}
	});
}

