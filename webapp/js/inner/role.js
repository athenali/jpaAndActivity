var table = null;

var URL_LIST = "../../rs/proj/role/list";
var URL_SAVE = "../../rs/proj/role/save";
var URL_VIEW = '../../rs/proj/role/view';
var URL_REMOVE = '../../rs/proj/role/removeById';

$(function(){
    //初始化左侧菜单点击效果
    //left_menu_attach_click();

	// 显示登录用户
	//initCurrentUser();

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
	$('#delSelect').click(checkSelect);

	// 全选
	$('#selectAll').click(selectAll);

	// 执行修改菜单
	$('#menuSaveBtn').click(doSaveMenu);

	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error'
    });
    $("FORM#editForm").validate({
        errorClass: 'validate-error'
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
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $.trim($('#name').val());
			}
			if ($('#code').val() != '') {
				jsonFilter.LIKE_code = $.trim($('#code').val());
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
			data : 'name'
		}, {
			data : 'code'
		}, {
			data : 'descn'
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal" data-id="' + data + '" onclick="preEdit(this);">修改</a>'
					+ '<a data-toggle="modal" data-target="#delModal" data-id="' + data + '" onclick="preDel(this);">删除</a>'
					+ '<a data-toggle="modal" data-target="#menuModal" class="menuLink" data-id="' + data + '" onclick="preMenu(this);">关联菜单</a>';
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
	$.get(URL_VIEW, {
		id: id
	}, function(result) {
		$('#editForm').setForm(result.data);
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

function preMenu(obj) {
	var roleId = $(obj).data('id');
	$('#roleId').val(roleId);

	var setting = {
		check: {
			enable: true
		},
		async: {
			enable: true,
			url: "../../rs/proj/role/roleMenu?roleId=" + roleId
		}
	};

	var zNodes = [];

	$.fn.zTree.init($("#menuTree"), setting, zNodes);
}

function doSaveMenu() {
	var roleId = $('#roleId').val();
	var menuIds = $.fn.zTree.getZTreeObj("menuTree").getCheckedNodes();

	var data = 'roleId=' + roleId;
	for (var i = 0; i < menuIds.length; i++) {
		data += '&menuIds=' + menuIds[i].id;
	}

	$.post('../../rs/proj/role/saveMenu', data, function(data) {
		$('#menuModal').modal('hide');
	});
}
