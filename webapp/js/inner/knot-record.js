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
		$("#content").load("../proj/knot-list.html");
	});
	
	
	// 日期控件
    $('.datepicker').datepicker({
		language: 'zh_CN',
		format: 'yyyy-mm-dd',
        autoclose: true,
		clearBtn: true,
	});
	
	$('#summaryForm').validate({
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
	//回显成员
	//viewSummary(id);
	//回显回款
	viewMoney(id);
	//回显项目负责人提交的终稿文件
	viewTaskFile(id);
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
//老版本---没用了
function viewTask_old(){
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

//回显成员---没用了
function viewSummary(id){
	//清空上次信息
//	$('#memberInfoForm table tbody').html('');
	var jsonFilter = {
	};
	jsonFilter.EQ_projectId = id
	jsonFilter = JSON.stringify(jsonFilter);
	$.get('../../rs/proj/memberinfo/list', {
		jsonFilter: jsonFilter
	}, function(result) {
		var modal = result.data.result;

		for (var i = 0; i < modal.length; i++) {
			var userId = modal[i].userId;
			if (userId == null || userId == '') {
				alert('userId cannot blank');
				return;
			}
			$('#memberInfoForm tbody').append('<tr>'+'<td>'+
				  '<input name="userId" type="hidden" value="' + userId + '">'+
				  '<input name="userName" type="hidden" value="'+modal[i].userName+'">'+
				  modal[i].userName+'</td>'+
				  '<td><select class="form-control" name="completeSchedule"><option>优秀</option><option>良好</option><option>中等</option><option>较差</option></select></td>'+
				  '<td><select class="form-control" name="completeQuality"><option>优秀</option><option>良好</option><option>中等</option><option>较差</option></select></td>'+
				  '<td><select class="form-control" name="manifeStation"><option>优秀</option><option>良好</option><option>中等</option><option>较差</option></select></td>'+
				  '</tr>');
		}
	})
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

//先保存审批，在保存成员表现情况
function doSaveApproval(){
	if(!$('#summaryForm').validate().form()){
		return;
	}
	if($('#knotFiles').children().length==0){
		alert("请上传结项文件");
		return ;
	}
	var data = $('#summaryForm').serialize();
	$.post('../../rs/proj/summary/save',data, function(result) {
		if(result.code==200){
			
			var summaryId = result.data.id;
			var projectId = result.data.projectId;
			$.each($('#knotFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="结项文件";
				var catalog = "结项文件";
				$.get('../../rs/proj/doc/updateOtherById', {
					id: id,
					businessId:summaryId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
					// 结项文件绑定infoId
					$.get('../../rs/proj/doc/updateInfoIdById', {
						id : id,
						projectId : projectId
					}, function(result) {
					});
				});
				
				
			});
			
			$("#content").load("../proj/knot-list.html");
		}else{
			$('#editErrorMessage').append(result.message);
		}
	});
}
//保存项目人员表现
function doSaveMemberEvaluate(summaryId){
	var data = $('#memberInfoForm').serialize();
	$.post('../../rs/proj/memberevaluate/batchSave',data, function(result) {
		if(result.code==200){
			//绑定结项文件
			var businessId = summaryId;
			$.each($('#knotFiles').children(),function(){
				var id = $(this).find('input').val();
				var businessName="结项文件";
				var catalog = "";
				$.get('../../rs/proj/doc/updateOtherById', {
					id: id,
					businessId:businessId,
					businessName:businessName,
					catalog:catalog
				}, function(result) {
					// 发起流程
					doStartProcess();
					//保存成功，加载结项页面，保存文件后重新加载页面
					$("#content").load("../proj/knot-list.html");
				});
			});
		}else{
		}
	});
	
}

function doStartProcess() {
	$.post('../../rs/proj/summary/startProcess', {
		id: $('#memberInfoForm input[name=summaryId]').val()
	}, function(result) {
	});
}

function refreshList() {
	table.api().ajax.reload();
}




