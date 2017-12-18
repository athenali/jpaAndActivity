var table = null;
var projid;
$(function(){
	// 初始化表格
	initTable();

	// 搜索
	$('#searchBtn').click(refreshList);

	// 全选
	$('#selectAll').click(selectAll);

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
			url: "../../projectmanage/api/salesBack/listQuery",
			dataSrc: "data.list"
		},
		serverParams: function (param) {
			if ('1' == getRole()) {
				// 登录人是领导
			} else {
				var ids = [];
				ids = controlUser();
				param.ids = ids;
			}
			if ($('#name').val() != '') {
				param.proName = $.trim($('#proName').val())
			}
			if ($('#type').val() != '') {
				param.proLader = $.trim($('#proLader').val())
			}
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row, meta) {
				//	返回table序号			
				return meta.row + 1;
			}
		}, {
			data : 'proName'
		}, {
			data : 'proLader'
		}, {
			data : 'customerName'
		}, {
			data : 'phone'
		}, {
			data : 'time'
		}, {
			data : 'proTotalPrice'
		},{
			data : 'salesBackPrice'
		},{
			data : 'remainderPrice'
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a onclick="preAdd(this)" data-id="' + data + '">追加回款</a>';
			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd(obj) {
	var id = $(obj).data('id');
	console.log(id)
	sessionStorage.setItem("id",id);
//	window.location="../proj/remittance-list.html"
	$("#content").load("../proj/prompt-list.html");
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/customer/save', data, function(result) {
		$('#addErrorMessage').html("");
		if(result.code==200){
			$('#addModal').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage').append(result.message);
		}
	});
}

function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}
	var data = $('#editForm').serialize();
	$.post('../../rs/proj/customer/save', data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal').modal('hide');
			refreshList();
		}else{
			$('#editErrorMessage').append(result.message);
		}
	});
}

function preDel() {
	var id = $(this).data('id');
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
		ids: array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}
//获得登录用户角色
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
// 获取当前用户可以看那些项目Id
function controlUser() {
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url : '../../rs/proj/info/userInfoControl',
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