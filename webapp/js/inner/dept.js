var table = null;

var URL_DEPT_LIST = "../../rs/proj/dept/list";
var URL_DEPT_SAVE = "../../rs/proj/dept/save";
var URL_DEPT_VIEW = '../../rs/proj/dept/view';
var URL_DEPT_REMOVE = '../../rs/proj/dept/removeById';
var URL_DEPT_SELECT_TREE = '../../rs/proj/dept/selectTree';

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
	$('#delSelect').click(checkSelect);

	// 全选
	$('#selectAll').click(selectAll);

	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error',
        rules: {
            code: {
                remote: {
                    url: '../../rs/proj/dept/checkCode'
                }
            }
        },
        messages: {
            code: {
                remote: "存在重复账号"
            }
        }
    });
    $("FORM#editForm").validate({
        errorClass: 'validate-error',
        rules: {
            code: {
                remote: {
                    url: '../../rs/proj/dept/checkCode',
                    data: {
                        id: function() {
                            return $('#dept_edit_id').val();
                        }
                    }
                }
            }
        },
        messages: {
            code: {
                remote: "存在重复账号"
            }
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
		ordering: true,
		bLengthChange: false,
		order : [ [ 1, "asc" ] ],// 默认排序字段的索引
		ajax: {
			url: URL_DEPT_LIST,
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if ($('#code').val() != '') {
				jsonFilter.LIKE_code = $.trim($('#code').val());
			}
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $.trim($('#name').val());
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },
        columnDefs : [ {
			"orderable" : false,
			"targets" : [ 0, 3 ]
		} ],
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			},
			width: "5%"
		}, {
			data : 'code'
		}, {
			data : 'name'
		},{
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

	$.post(URL_DEPT_SELECT_TREE, {
	}, function(result) {
		$('#dept_add_parentId').html('<option value=""></option>');
		$.each(result.data, function(index, item) {
			$('#dept_add_parentId').append('<option value="' + item.id + '">' + item.name + '</option>');
		});
	});
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post(URL_DEPT_SAVE, data, function(result) {
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

	$.post(URL_DEPT_SELECT_TREE, {
	}, function(result) {
		$('#dept_edit_parentId').html('<option value=""></option>');
		$.each(result.data, function(index, item) {
			$('#dept_edit_parentId').append('<option value="' + item.id + '">' + item.name + '</option>');
		});

		$.get(URL_DEPT_VIEW, {
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
	$.post(URL_DEPT_SAVE, data, function(result) {
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
	$.post(URL_DEPT_REMOVE, {
		ids: array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}
