var table = null;
var currentUserId = null;
$(function() {
	currentUserId =sessionStorage.getItem("currentUserId");
	// 自定补全项目名称
	$("#addProjectName").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength : 1,
		select : function(event, ui) {
			$('#addForm input[name=addProjectName]').val(ui.item.lable);
			findList(ui.item.id);
		}
	});
	$("#projectName").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength :1,
		select : function(event, ui) {
			$('#select input[name=projectName]').val(ui.item.lable);
			
		}
	});

	$("#editProjectName").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength : 1,
		select : function(event, ui) {
			$('#editForm input[name=editProjectName]').val(ui.item.lable);
			$("#editEvectionUsers").multipleSelect("setSelects", new Array()); // 修改项目名称对出差人进行清空操作
			findeditList(ui.item.id);
		}
	});
	

	//日期控件
	layui.use('laydate', function(){
		var laydate = layui.laydate;
		//查询
		laydate.render({
		  elem: '#startDate' 
		});
		laydate.render({
			  elem: '#endDate' 
			});
		laydate.render({
			  elem: '#add_startDate' 
			});
		laydate.render({
			  elem: '#add_endtDate' 
			});
		laydate.render({
			  elem: '#edit_startDate' 
			});
		laydate.render({
			  elem: '#edit_endtDate' 
			});
	});	
	// 显示登录用户
	initCurrentUser();
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
	// 新增清理
	$('#addLink').click(preAdd);
	// 执行新增
	$('#addSaveBtn').click(doAdd);

	// 执行删除
	$('#delBtn').click(doDel);
	// 批量删除确认
	$('#delSelect').click(checkSelect);
	// 撤销
	$('#withdrawBtn').click(doWithdrawBtn);
	// 全选
	$('#selectAll').click(selectAll);
	// 提交
	$('#startBtn').click(doStartBtn);
	// 校验表单
	$("FORM#addForm").validate({
		errorClass : 'validate-error'
	});
	$("FORM#editForm").validate({
		errorClass : 'validate-error'
	});
})
//根据团体或者个人显示出差人框
	  $(":radio").click(function(){
		  var  message=$('input[name="organ"]:checked').val();
		  if(message=='team'){
			  $("#evectionUsers").multipleSelect("setSelects",
						"");
				$("#showUsers").show();
			}else{
				$("#showUsers").hide();
			}
		  });
	  //出差类型的点击事件
	  $("#type").change(function(){
		var type=  $(this).val()
	           if(type=="001"){
	        	   $("#proj").show();
	        	   $("#organize").show();
	        	 //  $("#showUsers").show();
	        	 //  findUserId(null,null,"001");
	           }else{
	        	   $("#proj").hide();
	        	   $("#organize").hide();
	        	   $("#showUsers").hide();
	        	 //  findUserId(null,null,"002");
	        	   
	           }
		 
		   });
function initTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
		"language" : {
			"url" : "../../cdn/public/datatable/Chinese.txt"
		}
	});
	table = $("#table")
			.dataTable(
					{
						retrieve : true,
						searching : false,
						serverSide : true,
						ordering : true,
						bLengthChange : false,
						order : [[8, "desc"]],//默认排序字段的索引
						ajax : {
							url : "../../rs/proj/evection/list",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							var jsonFilter = {};
							jsonFilter.EQ_userId = currentUserId;
							if ($('#projectName').val() != '') {
								jsonFilter.LIKE_projectName = $('#projectName')
										.val();
							}
							if ($('#status').val() != '') {
								jsonFilter.EQ_status = $('#status').val();
							}
							if ($('#startDate').val() != '') {
								jsonFilter.GTE_startDate = $('#startDate')
										.val();
							}
							if ($('#endDate').val() != '') {
								jsonFilter.LTE_endDate = $('#endDate').val();
							}if ($('#evectionType').val() != '') {
								jsonFilter.EQ_type = $('#evectionType').val();
							}
							param.jsonFilter = JSON.stringify(jsonFilter);
						},
						columnDefs: [{ 
							        	"orderable": false, "targets": [0,1,10] //设置tab索引0，11 列不排序
						}],
						columns : [
								{
									data : 'id',
									render : function(data, type, row) {
										return '<input type="checkbox" value="'
												+ data
												+ '" class="selectedItem">'
									}
								},
								{
									data : 'id',
									render : function(data, type, row, meta) {
										return meta.row + 1
									}
								},{
									data : 'reason',
							/*		render : function(data, type, row) {
										return '<a data-toggle="modal" data-target="#addModal" onclick="preEdit(this)" data-catalog="链接查看" data-id="'
												+ row.id
												+ '" data-projid="'
												+ row.projectId
												+ '" data-type="'
												+ row.type
												+ '">'
												+ data
												+ '</a>'
									},*/
									render : function (data , type , row){
										return getTableRow(data,'80px')
										}
								
								},
								{
									data : 'type',
									render : function(data, type, row) {
										var v;
										if(data=="001"){
											v="项目出差";
										}if(data=="002"){
											v="会议出差";
										}
										return v;
									}
								},
								{
									data : 'projectName',
									render : function (data , type , row){
										return getTableRow(data,'80px')
										}
								
								},
							/*	{
									data : 'userName'
								},*/
								{
									data : 'evectionUserNames',
									render : function (data , type , row){
										return getTableRow(data,'70px')
										}
								},
								
								{
									data : 'startDate'
								},
								{
									data : 'endDate'
								},
								{
									data : 'createTime'
								},
								{
									data : 'status',
									render : function(data, type, row) {
										var v;
										if (data == "complete") {
											v = "审核完成";
										}
										if (data == "draft") {
											v = "草稿";
										}
										if (data == "inProgress") {
											v = "审核中";
										}
										if (data == "recal") {
											v = "已撤退";
										}
										return v;
									}
								},
								{
									data : 'id',
									render : function(data, type, row) {
										if (row.status == 'draft'
												|| row.status == 'recal') {
											return '<a data-toggle="modal" data-target="#addModal" onclick="preEdit(this)" data-catalog="修改" data-id="'
													+ data
													+ '" data-projid="'
													+ row.projectId
													+ '" data-type="'
													+ row.type
													+ '">修改</a>'
													+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(this)" data-type="'+row.type+'" data-id="'
													+ data 
													+ '">删除</a>'
													+ '<a data-toggle="modal" data-target="#startModal" onclick="preStart(this)" data-id="'
													+ data + '">提交</a>';
										} else if (row.status == 'inProgress') {
											return '<a data-toggle="modal" data-target="#withdrawModal" onclick="preWithdraw(this)" data-id="'
													+ data
													+ '">撤退</a>'
													+ '<a data-toggle="modal"  onclick="findSelect(this)"  data-id="'
													+ data
													+ '">查看</a>'
													+ '<a data-toggle="modal"  onclick="preGraph(this)"  data-id="'
													+ data + '">查看流程图</a>';
										} else {
											return '<a data-toggle="modal"   onclick="findSelect(this)"   data-id="'
													+ data + '">查看</a>'
													+ '<a data-toggle="modal"  onclick="preComplete(this)"  data-id="'
													+ data + '">查看流程图</a>';
										}
									}
								} ]
					});
}

function refreshList() {
	table.api().ajax.reload();
}
function findList(projectId) {
	$.post('../../rs/proj/memberinfo/findList?projectId=' + projectId, {},
			function(data) {
				var html = new Array();
				debugger
				$(data.data.projm).each(
						function(index, obj) {
							html.push("<option value='" + obj.userId + "'>"
									+ obj.userName + "</option>");
						});
				html.push("<option value='" + data.data.projInfo.managerId + "'>"
									+ data.data.projInfo.managerName + "</option>")
				$("#evectionUsers").html(html.join(""));
				multipleSelect("evectionUsers");
			});
}

function multipleSelect(name) {
	$("#" + name).multipleSelect({
		filter : true
	});
}

function preAdd() {
	// 清楚错误信息
	$('#addErrorMessage').html("");
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	$('#id').remove();
	 $("#proj").show();
	 $("#organize").show();
}

function doAdd() {
	if (!$('#addForm').validate().form()) {
		return;
	}
	var data = $('#addForm').serialize();
	$.post('../../rs/proj/evection/save', data, function(result) {
		$('#addErrorMessage').html("");
		if (result.code == 200) {
			$('#addModal').modal('hide');
			refreshList();
		} else {
			$('#addErrorMessage').append(result.message);
		}
	});
}
//开始时间和结束时间校验
function validation(){
	var startDate = new Date($('#addModal input[name=startDate]').val()).getTime();// 开始时间毫秒值
	var endDate = new Date($('#addModal input[name=endDate]').val()).getTime();// 结束时间毫秒值
	if (startDate > endDate) {
		alert("项目开始时间不能大于结束时间");
		return false;
	}
}
/* 编辑时回显 */
function view(id) {
	multipleSelect("evectionUsers");
	$.post('../../rs/proj/evection/view', {
		id : id
	}, function(result) {
		$('#addForm').setForm(result.data);
		var type=result.data.type;
		var radio=result.data.organ;
		var newType=null;
		 var ro=document.getElementsByName('organ');
	if(type=="001"){
		newType='team';
		debugger
		if(radio=="team"){
			$("#evectionUsers").multipleSelect("setSelects",
					result.data.evectionUsers.split(","));
			ro[0].checked=true;
		}else{
			$('#showUsers').hide();
			ro[1].checked=true;
		}
		
	}else{
		newType='personal';
	}
	$('input[name="type"]').value=newType ;
	});
}
/* 编辑时获取审批人 */
/*function findUserId(id,projid,type) {
	if(type=='001'){
		$("#proj").show();
 	   $("#organize").show();
 	  // $("#showUsers").show();
	}else{
		$("#proj").hide();
	 	$("#organize").hide();
	 	$("#showUsers").hide();
	}
	$.post('../../rs/proj/user/findUserId', {
		type:type
	}, function(data) {
		if(data.data.approval==""){
			$("#add_approval").hide();
			$("#add_approvalName").hide();
		}else{
			$("#add_approval").show();
			$("#add_approvalName").show();
		
		var html = new Array();
		$(data.data).each(function(index, obj) {
			html.push("<option value='" + obj.approval + "'>"
					+ obj.deptName + "</option>");
		});
		$("#add_approval").html(html.join(""));
		}
	});
}*/
function findeditList(projid, id) {
	$.post('../../rs/proj/memberinfo/findList?projectId=' + projid, {},
			function(data) {
		debugger
				var html = new Array();
				$(data.data.projm).each(
						function(index, obj) {
							html.push("<option value='" + obj.userId + "'>"
									+ obj.userName + "</option>");
						});
				html.push("<option value='" + data.data.projInfo.managerId + "'>"
						+ data.data.projInfo.managerName + "</option>")
				$("#evectionUsers").html(html.join(""));
				multipleSelect("evectionUsers");
				view(id);
			});
}
function preEdit(obj) {
	var id = $(obj).data('id'); // 获取点击的行id
	var type = $(obj).data('type');
	var projid = $(obj).data('projid');// 获取项目id
	// 清空错误信息
	$('#addForm')[0].reset();
	$('#addForm').validate().resetForm();
	if(type=="001"){
		$("#proj").show();
  	   $("#organize").show();
  	   $("#showUsers").show();
		findeditList(projid, id);
	}else{
		$("#proj").hide();
	  	$("#organize").hide();
		$("#showUsers").hide();
		view(id);
	}
		

}


function findSelect(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/evectionFind1.html");
}
function preDel(obj) {
	var id = $(obj).data('id');
	$('input.selectedItem').prop('checked', false);
	$('input[value=' + id + '].selectedItem').prop('checked', true);
}
// 撤退
function preWithdraw(obj) {
	$('#withdrawModal').data('id', $(obj).data('id'));
}

function doWithdrawBtn() {
	$.post('../../rs/proj/evection/withdraw', {
		id : $('#withdrawModal').data('id')
	}, function(data) {
		$('#withdrawModal').modal('hide');
		refreshList();
	});
}

function preStart(obj) {
	$('#startModal').data('id', $(obj).data('id'));
}

function doStartBtn() {
	$.post('../../rs/proj/evection/startProcess', {
		id : $('#startModal').data('id')
	}, function(data) {
		backlogTask();
		$('#startModal').modal('hide');
		refreshList();
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
	$.post('../../rs/proj/evection/delete', {
		ids : array
	}, function(result) {
		console.log(result);
		if (result.data.length > 0) {
			var html = new Array();
			$(result.data).each(function(index, obj) {
				html.push("<tr>");
				html.push("<td>");
				html.push(obj);
				html.push("</td>");
				html.push("</tr>");
			});
			html.push("<tr>");
			html.push("<td>");
			html.push("这些项目无法删除");
			html.push("</td>");
			html.push("</tr>");
			$("#tbody").html(html.join(""));
			$('#delModal').modal('hide');
			$('#errorModal').modal('show');
		} else {
			$('#delModal').modal('hide');
		}
		refreshList();
	});
}

function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}

function preGraph(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/flow-graph.html");
}
function preComplete(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("id", id);
	$("#content").load("../proj/flow-complete.html");
}

