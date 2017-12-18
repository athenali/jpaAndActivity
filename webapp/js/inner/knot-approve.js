var infoId = 0;
var summaryId = 0;

var summaryData = null;

$(function(){
	//初始化tabs
	$( "#tabs" ).tabs();
});

$(function(){
	$.post('../../rs/proj/summary/projInfo', {
		taskId: sessionStorage.getItem('id')
	}, function(result) {
		summaryData = result.data;
		infoId = result.data.projectId;
		summaryId = result.data.id;

		doAfterInit();
	});
});

function doAfterInit() {
	//回显
	doviewInfo(infoId);

	$('#summary_task_customerEvaluate').html(summaryData.customerEvaluate);
	$('#summary_task_content').html(summaryData.content);
	$('#summary_task_summaryFile').html('<a href="../../rs/proj/doc/download?path=' + summaryData.summaryFile + '">下载</a>');

	$('#approveBtn').click(doApprove);
	$('#rejectBtn').click(doReject);
}

function doviewInfo(infoId){
	var id = infoId;
	//将id存在隐藏域，用于刷新页面
	$('#viewInfoId').val(id);
	//成员表现Form中的项目Id
	$('#projectId').val(id);
	viewInfo(id);
}

//回显项目基本信息
function viewInfo(id){
	
	//清空上次数据
	$('#memberInfoForm tbody').html('');
	$('#fileTable tbody').html('');
	$('#bidFileTable tbody').html('');
	$('#contractFileTable tbody').html('');
	$('#taskFileTable tbody').html('');
	$('FORM#summaryForm')[0].reset();
	$('FORM#summaryForm').validate().resetForm();
	
	//将Id放入工作总结隐藏域，用于刷新页面
	$('#projectId').val(id);
//	//将id放入summary表单中
	$('#summaryForm input[name=projectId]').val(id);
	
	$.get('../../rs/proj/info/view', {
		id: id
	}, function(result) {
		$('#name').html(result.data.name);
		$('#manager').html(result.data.manager);
		$('#customerName').html(result.data.customerName);
		$('#startDate').html(result.data.startDate);
		$('#endDate').html(result.data.endDate);
		$('#status').html(result.data.status);
		 
	});
	//回显文件
	viewInfoFile(id);
	//回显成员
	viewSummary(id);
	//回显回款
	viewMoney(id);
}

//回显文件
function viewInfoFile(id){
	$.get('../../rs/proj/doc/listByProjectId', {
		projectId: id
	}, function(result) {
		var files = result;
		for(var i = 0; i<files.length;i++)
		 {
			if(files[i].catalog=='需求大纲文件'){
				$('#demandInfoTable tbody').append(
						'<tr>'+
						  '<td>'+'<a href="../../projectmanage/api/file/download?path='+files[i].path+'&name='+files[i].fileName+'">'+files[i].fileName+'</a>'+'</td>'+
			 	 		  '<td>'+files[i].userName+'</td>'+
			 	 		  '<td>'+files[i].createTime+'</td>'+
			 	 		  '<td>已提交</td>'+
			 	 		'</tr>');
			}
			else if(files[i].catalog=='投标招标文件'){
				$('#bidFileTable tbody').append(
						'<tr>'+
						  '<td>'+'<a href="../../projectmanage/api/file/download?path='+files[i].path+'&name='+files[i].fileName+'">'+files[i].fileName+'</a>'+'</td>'+
			 	 		  '<td>'+files[i].userName+'</td>'+
			 	 		  '<td>'+files[i].createTime+'</td>'+
			 	 		  '<td>已提交</td>'+
			 	 		'</tr>');
			}else if(files[i].catalog=='合同评审文件'){
				$('#contractFileTable tbody').append(
						'<tr>'+
						  '<td>'+'<a href="../../projectmanage/api/file/download?path='+files[i].path+'&name='+files[i].fileName+'">'+files[i].fileName+'</a>'+'</td>'+
			 	 		  '<td>'+files[i].userName+'</td>'+
			 	 		  '<td>'+files[i].createTime+'</td>'+
			 	 		  '<td>已提交</td>'+
			 	 		'</tr>');
			}else{
				/*$('#taskFileTable tbody').append(
						'<tr>'+
						  '<td>'+'<a href="../../projectmanage/api/file/download?path='+files[i].path+'&name='+files[i].fileName+'">'+files[i].fileName+'</a>'+'</td>'+
			 	 		  '<td>'+files[i].userName+'</td>'+
			 	 		  '<td>'+files[i].createTime+'</td>'+
			 	 	  	  '<td>已提交</td>'+
			 	 		'</tr>');*/
			}
			
		}
		
	})
	viewTask();
}
//回显任务，任务文件

function viewTask(){
	//通过projectId查询所有任务
	$.get('../../rs/proj/task/findByProjectId', {
		projectId: $('#projectId').val()
	}, function(result) {
		var files = result.data;
		for(var i = 0;i<files.length;i++){
			if(files[i].path!=null){
				$('#taskFileTable tbody').append('<tr>'+
						  '<td>'+files[i].taskName+'</td>'+
						  '<td>'+'<a href="../../projectmanage/api/file/download?path='+files[i].path+'&name='+files[i].fileName+'">'+files[i].fileName+'</a>'+'</td>'+
			 	 		  '<td>'+files[i].userName+'</td>'+
			 	 		  '<td>'+files[i].createTime+'</td>'+
			 	 		  '<td>已提交</td>'+
			 	 		'</tr>');
			}else{//没有终稿文件
				$('#taskFileTable tbody').append('<tr>'+
						  '<td>'+files[i].taskName+'</td>'+
						  '<td></td>'+
			 	 		  '<td></td>'+
			 	 		  '<td></td>'+
			 	 		  '<td>未提交</td>'+
			 	 		'</tr>');
			}
		}
	});
	
}

//回显成员
function viewSummary(id){
	//清空上次信息
//	$('#memberInfoForm table tbody').html('');
	var jsonFilter = {
	};
	jsonFilter.EQ_summaryId = summaryId
	jsonFilter = JSON.stringify(jsonFilter);
	$.get('../../rs/proj/memberevaluate/list', {
		jsonFilter: jsonFilter
	}, function(result) {
		var model = result.data.result;

		for (var i = 0; i < model.length; i++) {
			var item = model[i];
			var userId = item.userId;
			if (userId == null || userId == '') {
				alert('userId cannot blank');
				return;
			}
			$('#memberInfoForm tbody').append('<tr>'
				+ '<td>' + item.userName + '</td>'
				+ '<td>' + item.completeSchedule + '</td>'
				+ '<td>' + item.completeQuality + '</td>'
				+ '<td>' + item.manifeStation + '</td>'
				+ '</tr>');
		}
	})
}
//显示回款
function viewMoney(id){
	$.get('../../rs/proj/info/viewMoney', {
		id:id
	}, function(result) {
		$('#proTotalPrice').html(result.data.proTotalPrice);
		$('#salesBackPrice').html(result.data.salesBackPrice);
		$('#remainderPrice').html(result.data.remainderPrice);
	})
}

function doApprove() {
	$.post('../../rs/proj/summary/approve', {
		id: sessionStorage.getItem("id"),
		comment: $('#textarea_reason').val()
	}, function(result) {
		$("#content").load("../proj/backlog-list.html");
	});
}

function doReject() {
	$.post('../../rs/proj/summary/reject', {
		id: sessionStorage.getItem("id"),
		comment: $('#textarea_reason').val()
	}, function(result) {
		$("#content").load("../proj/backlog-list.html");
	});
}
