var infoId = 0;

$(function(){
	//初始化tabs
	$( "#tabs" ).tabs();
});

$(function(){
	infoId = sessionStorage.getItem("infoId");	
	//回显
	doviewInfo(infoId);
	
	//给领导审批..审批
	$('#approvalBtn').click(doSaveApproval);
	//返回
	$('#returnBtn').click(function (){
		backlogTask();
		$("#content").load("../proj/backlogTask.html");
	});
	
	
	// 日期控件
    $('.datepicker').datepicker({
		language: 'zh_CN',
		format: 'yyyy-mm-dd',
        autoclose: true,
		clearBtn: true,
	});
	
	$("FORM#summaryForm").validate({
        errorClass: 'validate-error'
    });
})
//结项文件上传
function uploadknotFile(){//绑定bisinessId
	oneupload(null,null,'knotFile','knotFiles');
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
		$('#manager').html(result.data.managerName);
		$('#customerName').html(result.data.customerName);
		$('#startDate').html(result.data.startDate);
		$('#endDate').html(result.data.endDate);
		$('#status').html(result.data.status);
		 
	});
	//回显文件
	viewInfoFile(id);
	//回显调研
	viewsurvey(id);
	//回显回款
	viewMoney(id);
	//回显项目负责人提交的终稿文件
	viewTaskFile(id);
	//回显总结
	viewSummary(id);
}
function viewSummary(id){
	$.post('../../rs/proj/summary/byprojId',{projId:id},function(result){
		$('#summaryForm textarea[name=content]').val(result.data.content);
		$('#summaryForm textarea[name=customerEvaluate]').val(result.data.customerEvaluate);
	})
	$.post('../../rs/proj/summary/findfile',{projId:id},function(result){
		console.log(result);
		//添加任务附件
		$('#knotFiles').empty();
		$.each(result.data,function(i,item){
			addFileInput(item,'knotFiles');
		})
		//取消删除按钮
		$('.deleteedittenderFile').empty();
		
	})
}
function checknull(obj){
	if(obj==null)
		return '';
	else
		return obj
}
function viewsurvey(id){
	$.post('../../rs/proj/taskrecord/finddiaoyan',{projId:id},function(result){
		$.each(result.data,function(i,item){
			var add = '';
			add += '<tr>';
			add += '<td>'+checknull(item.executorName)+'</td>';
			add += '<td>'+checknull(item.endTime)+'</td>';
			add += '<td>'+checknull(item.status)+'</td>';
			$.ajax({
				url:'../../projectmanage/api/file/findmap',
				data:{businessId:item.id},
				async:false,
				dataType:"json",
				success:function(data){
					add += '<td>';
					for(var key in data.data){
						add += '<a href="../../projectmanage/api/file/download?path='+key +'&name='+data.data[key]+'">' + data.data[key] + '</a>';
					}
					add += '</td>';
				}
			});
			add += '<td>'+checknull(item.content)+'</td>';
			add += '<td>'+checknull(item.dockingName)+'</td>';
			add += '<td>'+checknull(item.dockingPhone)+'</td>';
			add += '<td>'+checknull(item.dockingDept)+'</td>';
			if(item.overtime==null)
				add += '<td></td>';
			else if(item.overtime)
				add += '<td><span style="color: #f00;">超时</span></td>';
			else
				add += '<td><span>未超时</span></td>';
			add += '</tr>';
			$('#surveyInfoTable tbody').append(add);
		});
	});
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
			else if(files[i].catalog=='投标文件'){
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
				
			}
		}
	})
}
//回显任务，任务文件-项目负责人提交的终稿文件
function viewTaskFile(id){
	$.get('../../rs/proj/doc/listTaskFileByProjectId', {
		projectId: id
	}, function(result) {
		var files = result.data;
		$.each(files, function(index , item){
			$('#taskFileTable tbody').append(
					'<tr>'+
					  '<td>'+'<a href="../../projectmanage/api/file/download?path='+item.path+'&name='+item.fileName+'">'+item.fileName+'</a>'+'</td>'+
		 	 		  '<td>'+item.userName+'</td>'+
		 	 		  '<td>'+item.createTime+'</td>'+
		 	 		  '<td>已提交</td>'+
		 	 		'</tr>');
		});
		
	});
}
//显示回款
function viewMoney(id){
	$.get('../../rs/proj/info/viewMoney', {
		id:id
	}, function(result) {
		$('#proTotalPrice').html(result.data.proTotalPrice+"元");
		$('#salesBackPrice').html(result.data.salesBackPrice+"元");
		$('#remainderPrice').html(result.data.remainderPrice+"元");
	})
}

function refreshList() {
	table.api().ajax.reload();
}
//修改项目状态为项目结束
function doSaveApproval(){
	$.post('../../rs/proj/info/setStatus',{projId:infoId,status:'项目结束'},function(result){
		if(result.code==200){
			alert('确认通过');
			//更新当前用户代办个数
			backlogTask();
			$("#content").load("../proj/backlogTask.html");
		}
	});
}