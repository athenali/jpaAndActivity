var table;
var taskId = 0;
var currentUserId;
var isdiaoyan = false;
var isfuzheren = false;
var reason = '';
$(function() {
	taskId = sessionStorage.getItem("taskId");
	currentUserId = sessionStorage.getItem("currentUserId");
	initTask();
	initTable();
	
	// 执行新增
	$('#addSaveBtn').click(doAdd);
	// 校验表单
    $("FORM#addForm").validate({
        errorClass: 'validate-error'
    });
})
// 回显任务基本信息
function initTask() {
	$.ajax({
				url : '../../rs/proj/dict/findTimeOverByCode',
				async : false,
				dataType : "json",
				success : function(result) {
					var html = new Array();
					$(result.data).each(function(index, obj) {
								html.push("<option value=")
								html.push(obj.value);
								html.push(">");
								html.push(obj.name);
								html.push("</option>)");
							});
					$('#timeoutReason select.form-control').html(html.join(""));
				}
			});
	$.ajax({
		url:'../../rs/proj/task/view',
		data:{id:taskId},
		async:false,
		dataType:"json",
		success:function(result){
			if(result.data.userId == currentUserId){
				isfuzheren = true;
				reason = result.data.timeoutReason;
			}else{
				isfuzheren = false;
			}
			$('#taskMsg').setForm(result.data);
			initTaskmunebar(result.data);
		}
	});
}
// 返回按钮
function returnClick() {
	$('#content').load('../proj/task-list.html')
}
// 初始化表格
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
		bLengthChange: false,
		ajax: {
			url: "../../rs/proj/taskrecord/list",
			dataSrc: "data"
		},
		serverParams: function (param) {
			var jsonFilter = {};
			jsonFilter.EQ_taskId = taskId;
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns:tableSetColumns()
	});
}
function tableSetColumns(){
	var columns = [];
	columns.push({
		data : 'executorName'
	});
	columns.push({
		data : 'endTime'
	});
	columns.push({
		data : 'status'
	});
	columns.push({
		data : 'id',
		render: function(data, type, row) {
			var add = '';
			$.ajax({
				url:'../../projectmanage/api/file/findmap',
				data:{businessId:data},
				async:false,
				dataType:"json",
				success:function(data){
					for(var key in data.data){
						add += '<a href="../../projectmanage/api/file/download?path='+key +'&name='+data.data[key]+'">' + data.data[key] + '</a>';
					}
				}
			});
			return add;
		}
	});
	columns.push({data : 'content'});
	if(isdiaoyan){
		columns.push({data : 'dockingName'});
		columns.push({data : 'dockingPhone'});
		columns.push({data : 'dockingDept'});
	}
	columns.push({
		data : 'overtime',
		render: function(data, type, row) {
			if(data==null)
				return '';
			if(data)
				return '<span style="color: #f00;">超时</span>';
			else
				return '<span>未超时</span>';
		}
	});
	return columns;
}
function refreshList() {
	table.api().ajax.reload();
	initTask();
}
function initTaskmunebar(task){
	$('#taskmunebar').html('');
	$('#taskmunebar').append('<a class="btn btn-default" href="../../projectmanage/api/file/downloadzip?taskId='+task.id+'">打包下载附件</a>');
	if(task.executorId.indexOf(currentUserId)!=-1?true:false){
		//查询项目状态判断是否显示按钮
		$.post('../../rs/proj/info/view',{id:task.projectId},function(result){
			var isshow = false;
			if(result.code==200){
				switch (task.type) {
			    case "出差调研":
			    	if(result.data.status=='合同签订'||result.data.status=='出差调研'||result.data.status=='调研完成')
			    		isshow = true;
			        break;
			    case "编写初稿":
			    	if(result.data.status=='调研完成'||result.data.status=='编写初稿'||result.data.status=='合同签订')
			    		isshow = true;
			        break;
			    case "编写终稿":
			    	if(result.data.status=='提交初稿'||result.data.status=='编写终稿')
			    		isshow = true;
			    	break;
				}
				if(isshow)
					$('#taskmunebar').append('<a class="btn btn-default" data-toggle="modal" data-target="#addModal" onclick="preAdd(this)" data-id = "'+task.id+'">处理我的任务</a>');
			}
		});
	}
	if(task.type=='出差调研'){
		//th只添加一次
		if(!isdiaoyan)
			$('#table tr').html('<th>姓名</th><th>完成时间</th><th>状态</th><th>附件</th><th>描述</th><th>对接人姓名</th><th>对接人电话</th><th>对接人部门</th><th>是否超时</th>');
		isdiaoyan = true;
		$('.diaoyan').css('display','inline');
	}else{
		isdiaoyan = false;
		$('.diaoyan').css('display','none');
	}
}
function preAdd(obj) {
	//清空错误信息并且清空form
	$('#addForm').validate().resetForm();
	$('#FileText').empty();
	$('#addErrorMessage').empty();
	//只有项目扶着人才可以填写超时原因
	if(isfuzheren){
		$.post('../../rs/proj/task/checkOverTime',{taskId:taskId},function(result){
			if(result.code==200)
				if(result.data){
					$('#timeoutReason').css('display','inline');
				}else{
					$('#timeoutReason').css('display','none');
				}
		});
		if(reason!= null && reason != undefined && reason != ''){
			$('#timeoutReason select.form-control').val(reason.substring(0,reason.indexOf(":")));
			$('#timeoutReason textarea.form-control').val(reason.substring(reason.indexOf(":") + 1));
		}
	}
	$.ajax({
		url:'../../rs/proj/taskrecord/view',
		async:false,
		data:{id:$(obj).data('id')},
		success:function(result){
			$('#addForm').setForm(result.data);
			//文件上传
			$("#File").change(function(){  
				oneupload(result.data.id, '完成任务附件');
	        });
			$.post('../../projectmanage/api/file/findlist',{businessId:result.data.id},function(data){
				$.each(data.data,function(i,item){
					addFileInput(item);
				})
			});
		}
	});
}
function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	//设置超时原因
	var textarea = $('#timeoutReason textarea.form-control').val();
	if (textarea != null && textarea && undefined && textarea != '') {
		$('#timeoutReason > input').val($('#timeoutReason select.form-control')
				.val()
				+ ':' + textarea);
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/taskrecord/save', data, function(result) {
		$('#addErrorMessage').html("");
		if(result.code==200){
			$('#addModal').modal('hide');
			refreshList();
		}else{
			$('#addErrorMessage').append(result.message);
		}
	});
}