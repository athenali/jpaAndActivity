var table = null;
var DemandInfoId = 0;
$(function(){
	//获得过来的参数DemandInfoId
	DemandInfoId = sessionStorage.getItem("demandInfoId");
 // 日期控件
    layui.use('laydate', function(){
		var laydate = layui.laydate;
		//新增
		laydate.render({
		  elem: '#startTime', //开始时间
		  type: 'datetime',
	      format: 'yyyy-MM-d HH:mm'
		});
		laydate.render({
		  elem: '#endTime', //结束时间
		  type: 'datetime',
		  format: 'yyyy-MM-d HH:mm'
		});
		//修改
		laydate.render({
		  elem: '#startTime_edit', //开始时间
		  type: 'datetime',
		  format: 'yyyy-MM-d HH:mm'
		});
		laydate.render({
		  elem: '#endTime_edit', //结束时间
		  type: 'datetime',
		  format: 'yyyy-MM-d HH:mm'
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
	$('#editSaveBtn').click(doEdit);
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
    //跳转回Info页面
	$('#selectAll').click(selectAll);
	
	$('.toInfoLikk').click(toDemandInfoList);
	
})

	//loadDemandInfoList
	function toDemandInfoList(){
		$('#content').load("../proj/demandInfo-list.html");
	}

function initTable() {
	
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
			url: "../../rs/proj/demandrecord/list",
			dataSrc: "data.result" //接受的类型
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			//拼json将DemandInfoId传到controller
			if (DemandInfoId != null) {
				jsonFilter.EQ_demandInfoId = DemandInfoId
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			}
		}, {
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'partyaPerson'
		}, {
			data : 'partybPerson'
		}, {
			data : 'startTime'
		}, {
			data : 'endTime'
		}, {
			data : 'communicationType'
		}, {
			data : 'meetingAdress'
		}, {
			data : 'status'
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#viewModal" onclick="view(this)" data-id="' + data + '">查看</a>'
					  +'<a data-toggle="modal" data-target="#editModal" onclick="preEdit(this)" data-id="' + data + '">修改</a>'
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
	//清空客户信息
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	//给demandInfoId赋值
	$('#addForm #demandInfoId').val(DemandInfoId);
	$('#addDemandRecordFiles').empty();
	
	//回显最新一次数据
	$.get('../../rs/proj/demandrecord/findByDemandInfoIdOrderByIdDesc', {
		demandInfoId: DemandInfoId,
	}, function(result) {
		if(result.code==200){
			$('#addForm').setForm(result.data);
		}
	});
	
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/demandrecord/save', data, function(result) {
		if(result.code==200){
			//保存跟踪，返回InfoId和保存的状态，更新到Info中
			var status = result.data.status;
			var demandInfoId = result.data.demandInfoId;
			$.get('../../rs/proj/demandinfo/updateStatusById', {
				id: demandInfoId,
				status:status
			}, function(result) {
				if(result.code==200){
					$('#addModal').modal('hide');
					refreshList();
				}
			});
			//绑定文件
			var businessId = result.data.id;
			$.each($('#addDemandRecordFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="机会追踪文件";
				var catalog = "机会追踪文件";
				$.get('../../rs/proj/doc/updateOtherById', {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
				});
			});
		}else{
			$('#addErrorMessage').append(result.message);
		}
	}
	);
}
function preEdit(obj){
	$('#editErrorMessage').html("");
	//清空客户信息
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();
	$('#editDemandRecordFiles').empty();
	var id =$(obj).data('id');
	//查询数据,用于显示,查看具体信息
	$.get('../../rs/proj/demandrecord/view', {
		id: id
	}, function(result) {
		//正常的数据回显
		$('#editForm').setForm(result.data);
		//回显文件
		var businessId =  result.data.id;
		$.get('../../rs/proj/doc/findByBusinessId', {
			businessId: businessId
		}, function(result) {
			$.each(result.data,function(){
				addFileInput(this,'editDemandRecordFiles');
			});
		});
	});
}


///////////////////////////////////////////view查看具体信息
function view(obj) {
	$('#viewForm')[0].reset();
	$('#viewForm').validate().resetForm();
	$('#viewDemandRecordFiles').empty();
	var id =$(obj).data('id');
	
	//查询数据,用于显示,查看具体信息
	$.get('../../rs/proj/demandrecord/view', {
		id: id
	}, function(result) {
		//正常的数据回显
		$('#viewForm').setForm(result.data);
		
		//回显文件
		var businessId =  result.data.id;
		$.get('../../rs/proj/doc/findByBusinessId', {
			businessId: businessId
		}, function(result) {
			$.each(result.data,function(){
				addFileInput(this,'viewDemandRecordFiles');
			});
			$('.deleteedittenderFile').remove();
		});
	});
	
}

function doEdit() {
	if (!$('#editForm').validate().form()) {
		return;
	}
	var data = $('#editForm').serialize();
	$.post('../../rs/proj/demandrecord/save',data, function(result) {
		if(result.code==200){
			//保存跟踪，返回InfoId和保存的状态，更新到Info中
			var status = result.data.status;
			var demandInfoId = result.data.demandInfoId;
			$.get('../../rs/proj/demandinfo/updateStatusById', {
				id: demandInfoId,
				status:status
			}, function(result) {
				if(result.code==200){
					$('#editModal').modal('hide');
					refreshList();
				}
			});
			
			//绑定文件
			var businessId = result.data.id;
			$.each($('#editDemandRecordFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="机会追踪文件";
				var catalog = "机会追踪文件";
				$.get('../../rs/proj/doc/updateOtherById', {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
				});
			});
		}else{
			$('#editErrorMessage').append(result.message);
		}
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
	$.post('../../rs/proj/demandrecord/removeById', {
		ids: array
	}, function(result) {
		//查询出最新时间的一条数据,保存到机会表中
		$.get('../../rs/proj/demandrecord/findByDemIdAndTime', {
			id: DemandInfoId
		}, function(result) {
			if(result.code==200){
				var status = result.data.status;
				var demandInfoId = result.data.demandInfoId;
				updateStatusById(status,demandInfoId);
			}else{
				$('#delModal').modal('hide');
				refreshList();
			}
		});
	});
}


function updateStatusById(status,demandInfoId){
	$.get('../../rs/proj/demandinfo/updateStatusById', {
		id: demandInfoId,
		status:status
	}, function(result) {
		if(result.code==200){
			$('#delModal').modal('hide');
			refreshList();
		}
	});
}


function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}
