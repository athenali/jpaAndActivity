var table = null;

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


	//复选框加事件
	$(document).delegate('#pName','change',finddemandInfo);
	//复选框加事件用于修改
	$(document).delegate('#editprojectName','change',editfinddemandInfo);
	
	// 修改准备
	$(document).delegate('.editLink', 'click', preEdit);
	// 执行修改
	$('#editSaveBtn').click(doEdit);

	// 删除确认
	$(document).delegate('.delLink', 'click', preDel);
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

	// 提交
	$(document).delegate('.startLink', 'click', preStart);
	$('#startBtn').click(doStartBtn);
	
})

function initTable() {
	//配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table").dataTable({
		searching: false,
		serverSide: true,
		ordering: false,
		ajax: {
			url: "../../rs/proj/task/personalTasks",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			
			if ($('#projectName').val() != '') {
				jsonFilter.LIKE_projectName = $('#projectName').val();
			}
			if ($('#bidDate1').val() != '') {
				jsonFilter.GT_bidDate_DATE = $('#bidDate1').val();
			}
			if ($('#bidDate2').val() != '') {
				jsonFilter.LT_bidDate_DATE = $('#bidDate2').val();
			}
			if ($('#winBidDate1').val() != '') {
				jsonFilter.GT_winBidDate_DATE = $('#winBidDate1').val();
			}
			if ($('#winBidDate2').val() != '') {
				jsonFilter.LT_winBidDate_DATE = $('#winBidDate2').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			}
		}, {
			data : 'processName'
		}, {
			data : 'taskName'
		}, {
			data : 'projectName'
		}, {
			data : 'projectLeader'
		}, {
			data : 'assignee'
		}, {
			data : 'createTime',
			render : function(data ,type ,row){
				var data1 = new Date(data);
				var month = data1.getMonth() + 1;
				var minutes = data1.getMinutes();
				if(minutes < 10 && minutes != '0'){
					minutes = "0" + minutes;
				}
				var v = data1.getFullYear() + "-" + month + "-" + data1.getDate() + " " + data1.getHours() + ":" + minutes;
				return v;
			}
		}, {
			data : 'status',
			render: function(data) {
				return '待审批';
			}
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a data-toggle="modal" data-target="#startModal" class="startLink" data-id="' + data + '">处理</a>';
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
	$('#pName').html("<option value=\"\" id=\"addop\">-请选择-</option>");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	//让选择文件域初始化
	$('#bidFile').prop('disabled', false);
	$('#bidFileUpload').show();
	$('#bidFileResult').hide();
	$('#bidFileName').html('');
	$('#tenderFile').prop('disabled', false);
	$('#tenderFileUpload').show();
	$('#tenderFileResult').hide();
	$('#tenderFileName').html('');
	}

function finddemandInfo(){
	//清空上次信息
	$('input[name=customerName]').val("");
	var demandInfoId = $('#pName option:selected').attr("data-id");
	//根据查询demandinfo中客户名称
	$.post('../../rs/proj/demandinfo/view?id='+demandInfoId+'',function(result){
		$('input[name=customerName]').val(result.data.customerName);
		$('#demandInfoId').val(result.data.id);
	});
}
function editfinddemandInfo(){
	$('input[name=customerName]').val("");
	var demandInfoId = $('#editprojectName option:selected').attr("data-did");
	//根据查询demandinfo中客户名称
	$.post('../../rs/proj/demandinfo/view?id='+demandInfoId+'',function(result){
		$('input[name=customerName]').val(result.data.customerName);
	});
	
}


function doAdd() {
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/bid/save', data, function(result) {
		$('#addErrorMessage').html("");
		if(result.code==200){
			$('#addModal').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage').append(result.message);
		}
	});
	
}

function preEdit() {
	$('#editErrorMessage').html("");
	$('#editForm')[0].reset();
	$('#editForm').validate().resetForm();

	//清空选择文件域
	$('#edittenderFile').prop('disabled', true);
	$('#edittenderFileUpload').hide();
	$('#edittenderFileResult').show();
	$('#edittenderFileName').html('');
	
	$('#editbidFile').prop('disabled', true);
	$('#editbidFileUpload').hide();
	$('#editbidFileResult').show();
	$('#editbidFileName').html('');
	
	var id = $(this).data('id');
	//先查询所有客户，将客户名添加到选择域中
	$('#editprojectName').html("<option value=\"\" id=\"editop\">-请选择-</option>");
	$.post('../../rs/proj/demandinfo/list',function(result){
		//查询所有客户信息
		var demandInfo = result.data.result;
		for(var i=0;i<demandInfo.length;i++){
			$('#editop').after("<option value='"+demandInfo[i].projectName+"' data-did='"+demandInfo[i].id+"'>"+demandInfo[i].projectName+"</option>");
		}
		//给隐藏域的demandinfo赋值
		$('input[name=demandInfo]').val(demandInfo.id);
		//回显所有数据
		$.get('../../rs/proj/bid/view', {
			id: id
		}, function(result) {
			var tenderFile = result.data.tenderFile;
			$('#edittenderFileUpload').attr("style","display: none;");
			$('#edittenderFile').attr("aria-invalid","false");
			$('#edittenderFile').attr("disabled","");
			$('#edittenderFileName').html("<a href=../../rs/proj/doc/download?path="+tenderFile+">投标文件</a>"+
									  "<input name='tenderFile' value='"+tenderFile+"' type='hidden'>"+
									  "<i class='deleteFile glyphicon glyphicon-remove' style='cursor:pointer;'></i>");
			var bidFile = result.data.bidFile;
			$('#editbidFileUpload').attr("style","display: none;");
			$('#editbidFile').attr("aria-invalid","false");
			$('#editbidFile').attr("disabled","");
			$('#editbidFileName').html("<a href=../../rs/proj/doc/download?path="+bidFile+">招标文件</a>"+
									   "<input name='bidFile' value='"+bidFile+"' type='hidden'>"+
								       "<i class='deleteFile glyphicon glyphicon-remove' style='cursor:pointer;'></i>");
			$('#editForm').setForm(result.data);
			
			
			//时间需要特殊处理(招标时间，投标时间，中标时间)
			var bidDate = result.data.bidDate;
			var tenderDate = result.data.tenderDate;
			var winBidDate = result.data.winBidDate;
			bidDate = new Date(bidDate);
			var month = bidDate.getMonth()+1;
			bidDate = bidDate.getFullYear()+"-"+month+"-"+bidDate.getDate()+" "+bidDate.getHours()+":"+bidDate.getMinutes();
			tenderDate = new Date(tenderDate);
			month = tenderDate.getMonth()+1;
			tenderDate = tenderDate.getFullYear()+"-"+month+"-"+tenderDate.getDate()+" "+tenderDate.getHours()+":"+tenderDate.getMinutes();
			winBidDate = new Date(winBidDate);
			month = winBidDate.getMonth()+1;
			winBidDate = winBidDate.getFullYear()+"-"+month+"-"+winBidDate.getDate()+" "+winBidDate.getHours()+":"+winBidDate.getMinutes();
			$('input[name=bidDate]').val(bidDate);
			$('input[name=tenderDate]').val(tenderDate);
			$('input[name=winBidDate]').val(winBidDate);
		});
		
	});
	
	
}

function doEdit() {
	if (!$('#editForm').validate().form()) {
			return;
	}
	var id = $('input[name=id]').val();
	var data = $('#editForm').serialize();
	$.post('../../rs/proj/bid/save?id='+id,data, function(result) {
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
	$.post('../../rs/proj/leave/removeById', {
		ids: array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function preStart() {
	$('#startModal').data('id', $(this).data('id'));
}

function doStartBtn() {
	$.post('../../rs/proj/task/completeTask', {
		id: $('#startModal').data('id')
	}, function(data) {
		$('#startModal').modal('hide');
		refreshList();
	});
}
