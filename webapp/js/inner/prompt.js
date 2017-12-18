var table1 = null;
var table2 = null;
var projid;
$(function(){
    // 日期控件
//    $('.form_datetime').datetimepicker({
//		language: 'zh-CN',
//		format: 'yyyy-mm-dd hh:ii',
//		autoclose:true,//选中关闭
//        todayBtn: true
//	});
    layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.form_datetime').each(function(){
	    laydate.render({
	      elem: this
	      ,type: 'datetime'
	    });
	  });
	});
    projid = sessionStorage.getItem("id");
	// 初始化表格
	initTable();

	// 新增清理
	$('#addLink1').click(preAdd1);
	$('#addLink2').click(preAdd2);
	// 执行新增
	$('#addSaveBtn1').click(doAdd1);
	$('#addSaveBtn2').click(doAdd2);

	// 执行修改
	$('#editSaveBtn1').click(doEdit1);
	$('#editSaveBtn2').click(doEdit2);
	//返回按钮
	$('.backLink').click(backLink);	

	// 执行删除
	$('#delBtn1').click(doDel1);
	$('#delBtn2').click(doDel2);
	// 批量删除确认
	$('#delSelect1').click(checkSelect1);
	$('#delSelect2').click(checkSelect2);

	// 全选
	$('#selectAll1').click(selectAll1);
	$('#selectAll2').click(selectAll2);

	// 校验表单
	$("FORM#addForm1").validate({
        errorClass: 'validate-error'
    });
	$("FORM#addForm2").validate({
		errorClass: 'validate-error'
	});	
	$("FORM#editForm").validate({
	 	errorClass: 'validate-error'
	});
})

function backLink(){
	$("#content").load("../proj/remittance-list.html");	
//	$('#iframe', window.parent.document).attr('src',"../proj/remittance-list.html");
}

function initTable() {
	
	//配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table1 = $("#table1").dataTable({
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bLengthChange: false,
		ajax: {
			url: "../../projectmanage/api/salesBack/detailListQuery",
			dataSrc: "data.list"
		},
		serverParams: function (param) {
			param.id = projid;
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem1">'
			}
		}, {
			data : 'proName'
		}, {
			data : 'proLader'
		}, {
			data : 'salesBackTime'
		}, {
			data : 'salesBackPrice'
		}, {
			data : 'description'
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal1" onclick="preEdit1(this)" data-id="' + data + '">修改</a>'+
				'<a data-toggle="modal" data-target="#delModal1" onclick="preDel1(this)" data-id="' + data + '">删除</a>';
			}
		}]
	});
	table2 = $("#table2").dataTable({
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bLengthChange: false,
		ajax: {
			url: "../../projectmanage/api/salesPress/detailListQuery",
			dataSrc: "data.list"
		},
		serverParams: function (param) {
			param.id = projid;
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem2">'
			}
		}, {
			data : 'customerName'
		}, {
			data : 'contactPeople'
		}, {
			data : 'phone'
		}, {
			data : 'pressTime'
		}, {
			data : 'description'
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#editModal2" onclick="preEdit2(this)" data-id="' + data + '">修改</a>'+
				'<a data-toggle="modal" data-target="#delModal2" onclick="preDel2(this)" data-id="' + data + '">删除</a>';
			}
		}]
	});
	
}

function refreshList() {
	table1.api().ajax.reload();
	table2.api().ajax.reload();
}

function preAdd1() {
	//清楚错误信息
	$('#addErrorMessage1').html("");
	$('#addForm1')[0].reset();
	$('#addForm1').validate().resetForm();
}
function preAdd2() {
	//清楚错误信息
	$('#addErrorMessage2').html("");
	$('#addForm2')[0].reset();
	$('#addForm2').validate().resetForm();
}

function doAdd1() {
	if (!$('#addForm1').validate().form()) {
		return;
	}
	var data = $('#addForm1').serialize()+'&id='+projid;
	$.post('../../projectmanage/api/salesBack/detailListQueryAdd', data, function(result) {
		$('#addErrorMessage1').html("");
		if(result.code==200){
			$('#addModal1').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage1').append(result.message);
		}
	});
}

function doAdd2() {
	if (!$('#addForm2').validate().form()) {
		return;
	}
	var data = $('#addForm2').serialize()+'&id='+projid;
	$.post('../../projectmanage/api/salesPress/detailListQueryAdd', data, function(result) {
		$('#addErrorMessage2').html("");
		if(result.code==200){
			$('#addModal2').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage2').append(result.message);
		}
	});
}

function preEdit1(ogj) {
	$('#editErrorMessage1').html("");
	$('#editForm1')[0].reset();
	$('#editForm1').validate().resetForm();
	var id = $(ogj).data('id');
	$.get('../../projectmanage/api/salesBack/detailItemQuery', {
		id: id
	}, function(result) {
		$('#editForm1').setForm(result.data);
	});
}
function preEdit2(obj) {
	var id = $(obj).data('id');
	$.get('../../projectmanage/api/salesPress/detailItemQuery', {
		id: id
	}, function(result) {
		$('#editForm2').setForm(result.data);
	});
}

function doEdit1() {
	if (!$('#editForm1').validate().form()) {
		return;
	}
	var data = $('#editForm1').serialize();
	$.post('../../projectmanage/api/salesBack/detailListQueryEdit', data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal1').modal('hide');
			refreshList();
		}else{
			$('#editErrorMessage1').append(result.message);
		}
	});
}
function doEdit2() {
	if (!$('#editForm2').validate().form()) {
		return;
	}
	var id = $(this).data('id');
	var data = $('#editForm2').serialize();
	$.post('../../projectmanage/api/salesPress/detailListQueryEdit', data, function(result) {
		$('#editErrorMessage').html("");
		if(result.code==200){
			$('#editModal2').modal('hide');
			refreshList();
		}else{
			$('#editErrorMessage2').append(result.message);
		}
	});
}

function preDel1(obj) {
	var id = $(obj).data('id');
	$('input.selectedItem1').prop('checked', false);
	$('input[value=' + id + '].selectedItem1').prop('checked', true);
}
function preDel2(obj) {
	var id = $(obj).data('id');
	$('input.selectedItem2').prop('checked', false);
	$('input[value=' + id + '].selectedItem2').prop('checked', true);
}

function checkSelect1() {
	if ($('input.selectedItem1:checked').length == 0) {
		$('#alertModal').modal('show');
	} else {
		$('#delModal1').modal('show');
	}
}
function checkSelect2() {
	if ($('input.selectedItem2:checked').length == 0) {
		$('#alertModal').modal('show');
	} else {
		$('#delModal2').modal('show');
	}
}

function doDel1() {
	var array = [];
	$.each($('input.selectedItem1:checked'), function() {
		array.push(this.value);
	});
	$.post('../../projectmanage/api/salesBack/detailDelete', {
		ids: array
	}, function(result) {
		$('#delModal1').modal('hide');
		refreshList();
	});
}
function doDel2() {
	var array = [];
	$.each($('input.selectedItem2:checked'), function() {
		array.push(this.value);
	});
	$.post('../../projectmanage/api/salesPress/detailDelete', {
		ids: array
	}, function(result) {
		$('#delModal2').modal('hide');
		refreshList();
	});
}

function selectAll1() {
	$('input.selectedItem1').prop('checked', $(this).prop('checked'));
}

function selectAll2() {
	$('input.selectedItem2').prop('checked', $(this).prop('checked'));
}