var table = null;

$(function(){
	//初始化下拉菜单
	initSelect();
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
function initSelect(){
	$.ajax({
		  type: 'POST',
		  url: '../../projectmanage/api/cost/findByCode',
		  data:'',
		  success: function(data){
			  $('#status').empty();
			  $('#status').append('<option value=all>所有状态</option>');
			  $.each(data.data,function(i,item){
				  $('#status').append('<option value='+item.value+'>'+item.name+'</option>');
			  });
		  },
		  async: false
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
			url: "../../projectmanage/api/cost/listQuery",
			dataSrc: "data.list"
		},
		serverParams: function (param) {
			if ($('#name').val() != '') {
				param.proName = $('#name').val()
			}
			if ($('#type').val() != '') {
				param.status = $('#status').val()
			}
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row ,meta) {
				// 返回table序号		
				return meta.row + 1
			}
		}, {
			data : 'proName'
		}, {
			data : 'proLader'
		}, {
			data : 'phone'
		}, {
			data : 'customerName'
		}, {
			data : 'status'
		}, {
			data : 'costTotal'
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a onclick=preShow(this) data-id="' + data + '">明细</a>';
			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

function preAdd() {
	//清楚错误信息
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
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

function preShow(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id",id);
	$("#content").load("../proj/costdetal-list.html");
//	$('#iframe', window.parent.document).attr('src',"../proj/costdetal-list.html");	
//	window.location="../proj/costdetal-list.html"
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

