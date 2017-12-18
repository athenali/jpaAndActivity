var table = null;

$(function(){
    layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.datepicker').each(function(){
	    laydate.render({
	      elem: this
	    });
	  });
	});
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
		ordering: true,
		bLengthChange: false,
		order : [[5, "desc"]],//默认排序字段的索引
		ajax: {
			url: "../../rs/proj/expert/list",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $.trim($('#name').val());
			}
			if ($('#jobTitle').val() != '') {
				jsonFilter.LIKE_jobTitle = $('#jobTitle').val()
			}
			
			if ($('#companyName').val() != '') {
				jsonFilter.LIKE_companyName = $.trim($('#companyName').val());
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
        columnDefs: [
         	        { 
         	        	"orderable": false, "targets": [0,8]
         	        }
                 ],
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			}
		}, {
			data : 'name',
			render: function(data,type,row){
				return '<a data-toggle="modal" data-target="#viewModal" onclick="view(this)" data-id="' + row.id + '">'+data+'</a>';
			}
		}, {
			data : 'gender'
		}, {
			data : 'birthday'
		}, {
			data : 'companyName'
		}, {
			data : 'jobTitle'
		}, {
			data : 'telephone'
		}, {
			data : 'email'
		}, {
			data : 'id',
			render: function(data, type, row) {
				return  '<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="' + data + '">修改</a>'
					   +'<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-id="' + data + '">删除</a>';
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

	var jobTitleField = $('#addForm select[name=jobTitle]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode: 'title'
	}, function(result) {
		jobTitleField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			jobTitleField.append(
				"<option value='" + item.value + "' data-id='" + item.value + "'>" + item.value + "</option>"
			);
		});
	});
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/expert/save', data, function(result) {
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

	var jobTitleField = $('#editForm select[name=jobTitle]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode: 'title'
	}, function(result) {
		jobTitleField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			jobTitleField.append(
				"<option value='" + item.value + "' data-id='" + item.value + "'>" + item.value + "</option>"
			);
		});

		var id =$(obj).data('id');
		$.get('../../rs/proj/expert/view', {
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
	$.post('../../rs/proj/expert/save', data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal').modal('hide');
			refreshList();
		}else{
			$('#editErrorMessage').append(result.message);
		}
	});
}

function view(obj){
	var id =$(obj).data('id');
	$.get('../../rs/proj/expert/view', {
		id: id
	}, function(result) {
		$('#viewForm').setForm(result.data);
	});
}

function preDel(obj) {
	var id =$(obj).data('id');
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
	$.post('../../rs/proj/expert/removeById', {
		ids: array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}
