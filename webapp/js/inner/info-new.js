var table = null;
var memberTable = null;
var expertTable = null;

var members;// 项目成员
$(function() {

	bindDatePicker();

	$("#contractName")
			.autocomplete(
					{
						source : "../../rs/proj/contract/findList",
						minLength : 1,
						select : function(event, ui) { // ui.item.id:123456
							$('#infoForm input[name=name]').val(ui.item.projectName);
							$('#infoForm input[name=contractId]').val(ui.item.id);
							$('#infoForm input[name=customerName]').val(ui.item.customerName);
							$('#infoForm input[name=telephone]').val(ui.item.telephone);
							$('#infoForm input[name=managerName]').val(ui.item.leader);
							$('#infoForm input[name=managerId]').val(ui.item.leaderId);
							// 项目类型
							$('#projectType option[value= '+ ui.item.projectType + ']').attr("selected", "selected");
							//合同中规定时间
							$('#resultDateCg').val(ui.item.resultDateCg);
							$('#resultDateZg').val(ui.item.resultDateZg);
							//金额
							$('#infoForm input[name=weight]').val("");
							$('#infoForm input[name=contractMoney]').val("");
							
						}
					});
	$("#infoForm #customerName").autocomplete({
		source : "../../rs/proj/customer/findList",
		minLength : 1,
		select : function(event, ui) { // ui.item.id:123456
			$('#infoForm input[name=customerId]').val(ui.item.customerId);
			$('#infoForm input[name=telephone]').val(ui.item.phone);
		}
	});

	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);

	$("FORM#infoForm").validate({
		errorClass : 'validate-error',
		rules: {
            name: {
                remote: {
                    url: '../../rs/proj/info/checkName',
                    data: {
                        id: function() {
                            return $('#infoForm input[name=id]').val();
                        }
                    }
                }
            }
        },
        messages: {
            name: {
                remote: "存在项目同名"
            },
        }
	});
	$("FORM#planInfoForm").validate({
		errorClass : 'validate-error'
	});

})
// 获取当前用户可以看那些项目Id
function controlUser() {
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url : '../../rs/proj/info/userInfoControl',
		data : {
			userId : userId
		},
		async : false,
		dataType : "json",
		success : function(data) {
			ids = data.data;
		}
	});
	if (ids.length < 1)
		ids.push(-1);
	return ids;
}
// 获得登录用户角色
function getRole() {
	var flag = '0';
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	var userRoles = currentUserAndRole.userRole;
	$.each(userRoles, function(i, item) {
		if (item.code == 'SYFZC' || item.code == 'YLD') {
			flag = 1;
		}
	});
	return flag;
}

function initTable() {
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
						order : [ [ 7, "desc" ] ],// 默认排序字段的索引
						ajax : {
							url : "../../rs/proj/info/list",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							var jsonFilter = {};
							if ('1' == getRole()) {
								// 登录人是领导
							} else {
								var ids = [];
								ids = controlUser();
								jsonFilter.IN_id = ids;
							}
							if ($('#name').val() != '') {
								jsonFilter.LIKE_name = $.trim($('#name').val());
							}
							if ($('#startDate').val() != '') {
								jsonFilter.GTE_startDate = $('#startDate').val();
							}
							if ($('#endDate').val() != '') {
								jsonFilter.LTE_endDate = $('#endDate').val();
							}
							if ($('#status').val() != '') {
								jsonFilter.LIKE_status = $('#status').val();
							}
							if ($('#customerName').val() != '') {
								jsonFilter.LIKE_customerName = $.trim($('#customerName').val());
							}
							param.jsonFilter = JSON.stringify(jsonFilter);
						},
						columnDefs : [ {
							"orderable" : false,
							"targets" : [ 0, 1, 8 ]
						} ],
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
								},
								{
									data : 'name',
									render : function (data , type , row){
										return getTableRow(data,'150px')
									}
								},
								{
									data : 'customerName',
									render : function(data,type,row){ 
										return getTableRow(data,'100px');
									}
								},
								{
									data : 'startDate'
								},
								{
									data : 'endDate'
								},
								{
									data : 'status',
									render : function(data, type, row) {
										if (data == "合同签订") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研.png"></img>'
													+ '<img src="../../img/projectStatus/初稿.png"></img>'
													+ '<img src="../../img/projectStatus/终稿.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "出差调研") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研3.png"></img>'
													+ '<img src="../../img/projectStatus/初稿.png"></img>'
													+ '<img src="../../img/projectStatus/终稿.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "调研完成") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿.png"></img>'
													+ '<img src="../../img/projectStatus/终稿.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "编写初稿") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿3.png"></img>'
													+ '<img src="../../img/projectStatus/终稿.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "提交初稿") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿' + (row.overTimeCG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/终稿.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "编写终稿") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿' + (row.overTimeCG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/终稿3.png"></img>'
													+ '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "提交终稿") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿' + (row.overTimeCG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/终稿' + (row.overTimeZG == "超时" ? 4 : 2) + '.png"></img>' + '<img src="../../img/projectStatus/结束.png"></img>';
										} else if (data == "结项申请") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿' + (row.overTimeCG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/终稿' + (row.overTimeZG == "超时" ? 4 : 2) + '.png"></img>' + '<img src="../../img/projectStatus/结束3.png"></img>';
										} else if (data == "项目结束") {
											return '<img src="../../img/projectStatus/合同2.png"></img>'  
													+ '<img src="../../img/projectStatus/调研' + (row.overTimeDY == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/初稿' + (row.overTimeCG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/终稿' + (row.overTimeZG == "超时" ? 4 : 2) + '.png"></img>'
													+ '<img src="../../img/projectStatus/结束2.png"></img>';
										}
										return "";
									}
								},{
									data : 'createTime'
								},
								{
									data : 'id',
									render : function(data, type, row) {
										if (row.status == '项目结束') {// row.status=='项目结束'
											return '<a onclick="toAll_infoHTML(' + data + ')">查看</a>'
										} else {
											return '<a onclick="toAll_infoHTML(' + data + ')">查看</a>'
													+ '<a data-toggle="modal" data-target="#modal" onclick="preEdit(' + data + ')" >修改</a>'
													+ '<a data-toggle="modal" data-target="#delModal" onclick="preDel(' + data + ')" >删除</a>'
										}
									}
								} ]
					});
}
function toAll_infoHTML(projectId) {
	$.get('../../rs/proj/info/view', {
		id : projectId
	}, function(result) {
		var contractId = result.data.contractId;
		// 获取机会Id
		var demandInfoId = 0;
		$.get('../../rs/proj/contract/view', {
			id : contractId
		}, function(result) {
			demandInfoId = result.data.demandInfoId;
			sessionStorage.setItem("contractId", contractId);
			sessionStorage.setItem("demandInfoId", demandInfoId);
			sessionStorage.setItem("projectId", projectId);
			// 跳页面
			$("#content").load("../proj/all_info.html");
		});

	});
}

// 初始化成员表格
function initAllMemberInfo(el) {
	UserPicker.userPicker.showModal({
		target : el
	});
}
// 初始化专家表格
function initExpertInfo() {
	$.extend(true, $.fn.dataTable.defaults, {
		"language" : {
			"url" : "../../cdn/public/datatable/Chinese.txt"
		}
	});
	expertTable = $("#tableExpert").dataTable(
			{
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,// 让自定义表格宽度生效
				bLengthChange:false,//隐藏显示多少条
				ajax : {
					url : "../../rs/proj/expert/list",
					dataSrc : "data.result"
				},
				serverParams : function(param) {
					var jsonFilter = {};
					param.jsonFilter = JSON.stringify(jsonFilter);
				},
				columns : [
						{
							data : 'name',
							render : function(data, type, row) {
								return '<input type="checkbox" value="' + data + '" class="selectedExpert"></br>'
							}
						}, {
							data : 'name'
						}, {
							data : 'researchField'
						}, {
							data : 'achievement'
						} ]
			});
}
function refreshList() {
	table.api().ajax.reload();
}

// 准备新增
function preAdd() {
	//项目类型
	var projectTypeField = $('#infoForm select[name=projectType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
	});
	//外聘专家
	$("#notNeedRadio").attr("checked", true);
	$("#needRadio").attr("checked", false);
	$('#needExpert').attr("style","display:none;width:420px");
	$('#needExpert').val("");
	
	// 点增加时，显示添加基本信息页面
	openInfoForm();
	$('#title').html('添加信息');
	// 清空错误信息
	$('#infoErrorMessage').html("");
	// 清空隐藏域的值
	$('#infoForm input[name=id]').val('');
	$('#infoForm input[name=contractId]').val('');
	$('#infoForm input[name=managerId]').val('');
	$('#infoForm input[name=customerId]').val('');
	$('#infoForm input[name=status]').val('合同签订');

	$('FORM#infoForm')[0].reset();
	$('FORM#infoForm').validate().resetForm();

	// 清空人员
	$('#selectedMember tbody').html("");
	// 清空计划
	$('FORM#planInfoForm')[0].reset();
	$('FORM#planInfoForm').validate().resetForm();
	$('#planInfoForm tbody')
			.html(
					'<tr>'
							+ '<td><input type="hidden" name="name" value="出差调研">出差调研</td>'
							+ '<td></td>'
							+ '<td><input type="text" class="form-control datepicker" name="startTime" placeholder="输入开始时间" required readonly/></td>'
							+ '<td><input type="text" class="form-control datepicker" name="endTime" placeholder="输入结束时间" required readonly/></td>'
							+ '<td><select multiple="multiple" id="task1" style="width: 250px;"></select>'
							+ '<input type="hidden" name="taskMemberId" id="taskMemberId1"/><input type="hidden" name="taskMemberName" id="taskMemberName1"/></td>'
							+ '</tr>'
							+ '<tr>'
							+ '<td><input type="hidden" name="name" value="编写初稿">编写初稿</td>'
							+ '<td><input type="text" id="resultDateCg" class="form-control" readonly/></td>'
							+ '<td><input type="text" class="form-control datepicker" name="startTime" placeholder="输入开始时间" required readonly/></td>'
							+ '<td><input type="text" class="form-control datepicker" name="endTime" placeholder="输入结束时间" required readonly/></td>'
							+ '<td><select multiple="multiple" id="task2" style="width: 250px;"></select>'
							+ '<input type="hidden" name="taskMemberId" id="taskMemberId2"/><input type="hidden" name="taskMemberName" id="taskMemberName2"/></td>'
							+ '</tr>'
							+ '<tr>'
							+ '<td><input type="hidden" name="name" value="编写终稿">编写终稿</td>'
							+ '<td><input type="text" id="resultDateZg" class="form-control" readonly/></td>'
							+ '<td><input type="text" class="form-control datepicker" name="startTime" placeholder="输入开始时间" required readonly/></td>'
							+ '<td><input type="text" class="form-control datepicker" name="endTime" placeholder="输入结束时间" required readonly/></td>'
							+ '<td><select multiple="multiple" id="task3" style="width: 250px;"></select>'
							+ '<input type="hidden" name="taskMemberId" id="taskMemberId3"/><input type="hidden" name="taskMemberName" id="taskMemberName3"/></td>'
							+ '</tr>"');
	// 重新绑定时间控件
	bindDatePicker();
	// 计划人员域初始化
	$('#task1').html("");
	$('#task2').html("");
	$('#task3').html("");
	multipleSelect("task1");
	multipleSelect("task2");
	multipleSelect("task3");

	// 让选择文件域初始化
	$('#demandFiles').html('');
	$('#taskFiles').html('');
}

// 选择专家
function selectNeedExeport(num) {
	if (num == 1) {// 点击需要
		$('#infoForm input[name=needExpert]').val("");
		$("#notNeedRadio").attr("checked", false);
		// 展示文本域
		$('#infoForm input[name=needExpert]').attr("style", "width:420px");
		$('#infoForm input[name=needExpert]').val("");
	} else {//
		$("#needRadio").attr("checked", false);
		$('#infoForm input[name=needExpert]').attr("style", "display:none");
		$('#infoForm input[name=needExpert]').val("0");
	}
}
function selectExpert(obj) {
	var elem = $(obj);
	$('#expertModal').modal('show');
	$.each($('input.selectedExpert:checked'), function() {
		$(this).attr('checked', false);
	});
	initExpertInfo();
}

// 添加专家信息
function appendExpert() {
	var array = [];
	var str = '';
	$.each($('input.selectedExpert:checked'), function() {
		array.push(this);
	});
	if (array == '[]') {
		return;
	}
	$.each(array, function() {
		str = str + $(this).val() + ',';
	});
	str = str.substring(0, (str.length) - 1);// 专家1，专家2
	$('#infoForm input[name=needExpert]').val(str);
	$('#expertModal').modal('hide');
}

// 添加人员信息
function appendMember() {
	// 在userpicker中
}
// 给select中option赋值
function setOptions() {
	var html = new Array();
	var membersTr = $('#selectedMember tbody').children();
	$.each(membersTr,
			function() {
				var userId = $(this).children().eq(0).children().eq(0).val();// userId
				var userName = $(this).children().eq(0).children().eq(1).val();// userName
				if (userName != undefined) {
					html.push("<option value=" + userId + ">" + userName
							+ "</option>");
				}
			});

	$("#task1").html(html);
	multipleSelect("task1");
	$("#task2").html(html);
	multipleSelect("task2");
	$("#task3").html(html);
	multipleSelect("task3");
}
// 初始化select
function multipleSelect(name) {
	$("#" + name).multipleSelect({
		filter : true
	});
}

// 删除成员
function delMember(obj) {
	var elem = $(obj);
	elem.parents('tr').remove();
	setOptions();
}
// 设置组长
function updateLeader(obj) {
	var elem = $(obj);
	elem.parents('tr').siblings().find('input[name=leader]').attr('checked',
			false);
	elem.attr('checked', true);
}

function preEdit(id) {
	openInfoForm();
	//项目类型
	var projectTypeField = $('#infoForm select[name=projectType]');
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode : 'projectType'
	}, function(result) {
		projectTypeField.html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list,
				function(index, item) {
					projectTypeField.append("<option value='" + item.value
							+ "' data-id='" + item.id + "'>" + item.name
							+ "</option>");
				});
		
		doPreEdit(id);
	});
}
function doPreEdit(id){
	$('#title').html('修改信息');

	$('#infoErrorMessage').html("");
	// 清空隐藏域的值
	$('#infoForm input[name=id]').val('');
	$('#infoForm input[name=contractId]').val('');
	$('#infoForm input[name=managerId]').val('');

	$('FORM#infoForm')[0].reset();
	$('FORM#infoForm').validate().resetForm();

	// 清空人员
	$('#selectedMember tbody').html('');
	// 清空计划
	$('#planInfoForm')[0].reset();
	$('#planInfoForm').validate().resetForm();
	// 让选择文件域初始化
	$('#demandFiles').html('');
	$('#taskFiles').html('');
	// 专家域隐藏
	$('#needExpert').attr('style', 'display:none');
	// 查询info数据,用于回显
	$.get('../../rs/proj/info/view', {
		id : id
	}, function(result) {

		var expert = result.data.needExpert;
		if (expert != null && expert != '0') {
			$("#needRadio").attr("checked", "checked");
			$("#notNeedRadio").attr("checked", false);
			// 展示文本域
			$('#needExpert').attr("style", "");
		} else {
			$("#notNeedRadio").attr("checked", "checked");
			$("#needRadio").attr("checked", false);
			$('#needExpert').attr("style", "display:none");
		}

		var businessId = result.data.id;
		$.get('../../rs/proj/doc/findByBusinessId', {
			businessId : businessId
		}, function(result) {
			$.each(result.data, function() {
				if (this.businessName == '需求大纲文件') {
					addFileInput(this, 'demandFiles');
				} else {
					addFileInput(this, 'taskFiles');
				}
			});
		});
		// 普通数据回显
		$('#infoForm').setForm(result.data);
	});
	// 回显成员，计划
	viewMember(id);
}



// 回显成员
function viewMember(id) {
	var jsonFilter = {};
	jsonFilter.EQ_projectId = id;
	jsonFilter = JSON.stringify(jsonFilter);
	$
			.get(
					'../../rs/proj/memberinfo/viewByInfoId',
					{
						jsonFilter : jsonFilter
					},
					function(result) {
						var member = result.data.result;
						members = result.data.result;
						for (var i = 0; i < member.length; i++) {
							// 判断这个人是不是组长
							var leader = member[i].leader;
							if (leader == '是') {
								$('#selectedMember')
										.append(
												'<tr><td>'
														+ '<input name="userId" value="'
														+ member[i].userId
														+ '" type="hidden">'
														+ '<input name="userName" value="'
														+ member[i].userName
														+ '" readonly="" type="text" class="form-control">'
														+ '</td><td>'
														+ '<input value="'
														+ member[i].userId
														+ '" onclick="updateLeader(this)" type="checkbox" checked name="leader">'
														+ '</td><td>'
														+ '<input class="btn btn-default" onclick="delMember(this)" value="删除" type="button"></td></tr>');
							} else {
								$('#selectedMember')
										.append(
												'<tr><td>'
														+ '<input name="userId" value="'
														+ member[i].userId
														+ '" type="hidden">'
														+ '<input name="userName" value="'
														+ member[i].userName
														+ '" readonly="" type="text" class="form-control">'
														+ '</td><td>'
														+ '<input value="'
														+ member[i].userId
														+ '"onclick="updateLeader(this)" type="checkbox" name="leader">'
														+ '</td><td>'
														+ '<input class="btn btn-default" onclick="delMember(this)" value="删除" type="button"></td></tr>');
							}
						}
						viewPlan(id);// 回显项目计划
					});
}

// 回显项目计划
function viewPlan(id) {
	var jsonFilter = {};
	jsonFilter.EQ_projectId = id;
	jsonFilter = JSON.stringify(jsonFilter);
	$.get(
					'../../rs/proj/planinfo/viewByInfoId',
					{
						jsonFilter : jsonFilter
					},
					function(result) {
						$('#planInfoForm #planInfoTbody').html('');
						var plan = result.data.result;
						for (var i = 0; i < plan.length; i++) {
							$('#planInfoTbody')
									.append(
											'<tr>'
													+ '<td><input type="hidden" name="name" value="' + plan[i].name + '">' + plan[i].name + '</td>'
													+ '<td>'+(plan[i].name=="出差调研"?'':'<input type="text" id="'+(plan[i].name=="编写初稿"?'resultDateCg':'resultDateZg')+'" class="form-control" readonly/>')+'</td>'
													+ '<td><input type="text" class="form-control datepicker" disabled name="startTime" value="' + plan[i].startTime + '" placeholder="请输入开始时间" required/></td>'
													+ '<td><input type="text" class="form-control datepicker" disabled name="endTime" value="' + plan[i].endTime + '" placeholder="请输入结束时间" required/></td>'
													+ '<td><input type="text" class="form-control" name="taskMemberName" value="'+plan[i].memberName+'" readonly/>'
													+ '<input type="hidden" name="taskMemberId" id="taskMemberId' + (i + 1) + '"/></td>'
											+ '</tr>')
						}
						// 重新绑定时间控件
						//bindDatePicker();
						//回显合同中时间
						vieContractDate();
						//回显成员，<select multiple="multiple" id="task' + (i + 1) + '" style="width: 250px;"></select>
						//viewAllMember(id, plan);
					});

}
function vieContractDate(){
	$.get('../../rs/proj/contract/view',
			{id:$('#infoForm input[name=contractId]').val()},
			function(result){
				var contract = result.data;
				$('#resultDateCg').val(contract.resultDateCg);
				$('#resultDateZg').val(contract.resultDateZg);
			});
}

// 回显select成员
function viewAllMember(id, plan) {
	for (var i = 0; i < members.length; i++) {
		$('#task1').append(
				"<option value=" + members[i].userId + ">"
						+ members[i].userName + "</option>");
		$('#task2').append(
				"<option value=" + members[i].userId + ">"
						+ members[i].userName + "</option>");
		$('#task3').append(
				"<option value=" + members[i].userId + ">"
						+ members[i].userName + "</option>");
	}
	multipleSelect("task1");
	multipleSelect("task2");
	multipleSelect("task3");
	for (var i = 0; i < plan.length; i++) {
		var arr = plan[i].memberId.split(",");
		$('#task' + (i + 1)).multipleSelect('setSelects', arr);
	}
	//选人只读
	$("#task1").multipleSelect("disable");
	$("#task2").multipleSelect("disable");
	$("#task3").multipleSelect("disable");
}

// 校验项目基本信息
function validateInfoForm() {
	if (!$('#infoForm').validate().form()) {
		return false;
	}
	if ($('#infoForm input[name=weight]').val() == "0") {
		alert("权重不能为0");
		return false;
	}
	if ($('#infoForm input[name=contractId]').val() == "") {
		alert("请选择合同");
		return false;
	}
	if ($('#infoForm input[name=managerId]').val() == "") {
		alert("请选择项目负责人");
		return false;
	}
	if ($('#infoForm input[name=managerName]').val() == "") {
		alert("请选择项目负责人");
		return false;
	}
	if($('#infoForm #demandFiles').children().length <1 ){
		alert("请上传需求大纲文件");
		return;
	}
	var startDate = new Date($('#infoForm input[name=startDate]').val()).getTime();// 开始时间毫秒值
	var endDate = new Date($('#infoForm input[name=endDate]').val()).getTime();// 结束时间毫秒值
	if (startDate >= endDate) {
		alert("项目开始时间不能大于结束时间");
		return false;
	}
	//校验权重
	if(!validateWeight()){
		return false;
		}
	//打开成员模块
	openMemberInfoForm();
	return true;
}
// 校验成员表单
function validateMemberInfo() {
	if ($('#memberInfoForm tbody').children().length < 1) {
		alert("请选择人员");
		return false;
	}

	// 判断项目成员是否包含项目负责人
	var managerId = $('#infoForm input[name=managerId]').val();
	var memberIds = $('#selectedMember tbody').find('input[name=userId]');
	for (var i = 0; i < memberIds.length; i++) {
		if (memberIds[i].value == managerId) {
			alert("请将项目负责人从项目成员中删除");
			return false;
		}
	}
	// 打开计划模块
	openPlanInfoForm();
	return true;
}
// 校验计划表单
function validatePlanInfo() {
	if($('#infoForm input[name=id]').val() == ''){//新增时校验,编辑时不校验
		var plans = $('#planInfoForm tbody').children('tr');
	
		for (var i = 0; i < plans.length; i++) {
			// 判断非空
			var t1 = plans.eq(i).children('td').eq(2).children().val();
			var t2 = plans.eq(i).children('td').eq(3).children().val();
			if (t1 == '' || t2 == '') {
				alert("请选择" + plans.eq(i).children('td').eq(0).children().val() + "时间");
				return;
			}
	
			var d1 = new Date(plans.eq(i).children('td').eq(2).children().val()).getTime();// 开始时间毫秒值
			var d2 = new Date(plans.eq(i).children('td').eq(3).children().val()).getTime();// 结束时间毫秒值
			if (d1 > d2) {
				alert(plans.eq(i).children('td').eq(0) .children("input:first-child").val() + "日期不正确");
				return;
			}
		}
		for (var i = 0; i < plans.length - 1; i++) {
			var d1 = new Date(plans.eq(i).children('td').eq(3).children().val()).getTime();// 当前名称的结束时间
			var d2 = new Date(plans.eq(i + 1).children('td').eq(2).children().val()).getTime();// 下一个名称的开始时间
			if (d1 > d2) {
				alert(plans.eq(i).children('td').eq(0) .children("input:first-child").val() + "的结束时间不能大于" + plans.eq(i + 1).children('td').eq(0).children("input:first-child").val() + "的开始时间");
				return;
			}
		}
		if ($('#task1 option:selected').length == 0) {
			alert("请选择出差调研成员");
			return false;
		}
		if ($('#task2 option:selected').length == 0) {
			alert("请选择编写初稿成员");
			return false;
		}
		if ($('#task3 option:selected').length == 0) {
			alert("请选择编写终稿成员");
			return false;
		}
	}
	// 校验任务文件
	if ($('#taskFiles').children().length < 1) {
		alert("请上传任务附件");
		 return false;
	}
	return true;
}
// 提交3个表单
function save() {
	// 校验表单
	if (!validateInfoForm()) {
		return;
	}
	if (!validateMemberInfo()) {
		return;
	}
	if (!validatePlanInfo()) {
		return;
	}
	// 判断表单有无Id,没有Id保存，有Id更新
	var id = $('#infoForm input[name=id]').val();
	getTaskMember("taskMemberId1", "taskMemberName1", "task1");
	getTaskMember("taskMemberId2", "taskMemberName2", "task2");
	getTaskMember("taskMemberId3", "taskMemberName3", "task3");
	if (id == '') {
		doSave();
	} else {
		doEdit();
	}

}
// 拼接项目成员
function getTaskMember(inputId, inputName, selectId) {
	// 拼接一个项目负责人Id和Name
	var managerId = $('#infoForm input[name=managerId]').val();
	var managerName = $('#infoForm input[name=managerName]').val();

	var memberId = managerId + ",";
	memberId += $('#' + selectId).multipleSelect('getSelects');// 1,2,3

	var memberName = managerName + ",";
	memberName += $('#' + selectId).multipleSelect('getSelects', 'text')// 张三,李四,王五

	$('#' + inputId).val(memberId);
	$('#' + inputName).val(memberName);
}
function doSave() {
	var dataInfo = $('#infoForm').serialize();
	$.post('../../rs/proj/info/save', dataInfo,
			function(result) {
				if (result.code == 200) {
					$('#infoForm input[name=id]').val(result.data.id);
					// 给添加计划时用到的数据赋值
					$('#planInfoForm input[name=projectId]')
							.val(result.data.id);
					$('#planInfoForm input[name=projectName]').val(
							result.data.name);
					$('#planInfoForm input[name=managerId]').val(
							result.data.managerId);
					$('#planInfoForm input[name=managerName]').val(
							result.data.managerName);

					// 绑定文件BusinessId,BusinessId就是项目Id
					var businessId = result.data.id;
					$.each($('#demandFiles').children(), function() {// 给需求大纲文件绑定businessId和infoId
						var demandId = $(this).find('input').val();
						$.get('../../rs/proj/doc/updateOtherAndProjectIdById', {
							id : demandId,
							businessId : businessId,
							businessName : "需求大纲文件",
							catalog : "需求大纲文件",
							projectId : businessId
						}, function(result) {
						});
					});
					$.each($('#taskFiles').children(), function() {// 给任务文件绑定businessId和infoId
						var taskFileId = $(this).find('input').val();
						$.get('../../rs/proj/doc/updateOtherAndProjectIdById', {
							id : taskFileId,
							businessId : businessId,
							businessName : "任务文件",
							catalog : "任务文件",
							projectId : businessId
						}, function(result) {
						});
					});
					// 保存人员
					saveMember();
					// 保存计划和任务
					savePlanAndTask();
				} else {
					openInfoForm();
					alert('保存失败:' + result.message);
				}
			});
}
// 执行修改
function doEdit() {
	var dataInfo = $('#infoForm').serialize();
	var id = $('#infoForm input[name=id]').val();
	$.post('../../rs/proj/info/save?id=' + id, dataInfo,
			function(result) {
				if (result.code == 200) {
					// 给添加计划时用到的数据赋值
					$('#planInfoForm input[name=projectId]')
							.val(result.data.id);
					$('#planInfoForm input[name=managerId]').val(
							result.data.managerId);
					$('#planInfoForm input[name=managerName]').val(
							result.data.managerName);

					// 绑定文件BusinessId,BusinessId就是项目Id
					var businessId = result.data.id;
					$.each($('#demandFiles').children(), function() {// 给需求大纲文件绑定businessId和infoId
						var demandId = $(this).find('input').val();
						$.get('../../rs/proj/doc/updateOtherAndProjectIdById', {
							id : demandId,
							businessId : businessId,
							businessName : "需求大纲文件",
							catalog : "需求大纲文件",
							projectId : businessId
						}, function(result) {
						});
					});
					$.each($('#taskFiles').children(), function() {// 给任务文件绑定businessId和infoId
						var taskFileId = $(this).find('input').val();
						$.get('../../rs/proj/doc/updateOtherAndProjectIdById', {
							id : taskFileId,
							businessId : businessId,
							businessName : "任务文件",
							catalog : "任务文件",
							projectId : businessId
						}, function(result) {
						});
					});
					// 保存人员
					saveMember_update();
					// 保存计划
					savePlan();
				} else {
					openInfoForm();
					alert('保存失败:' + result.message);
				}
			});
}
// 保存成员
function saveMember() {
	$('#memberInfoForm input[name=projectId]').val(
			$('#infoForm input[name=id]').val());
	var dataMemberInfo = $('#memberInfoForm').serialize();
	$.post('../../rs/proj/memberinfo/batchSave', dataMemberInfo, function(
			result) {
		if (result.code == 200) {
		} else {
		}
	});
}
// 保存成员
function saveMember_update() {
	$('#memberInfoForm input[name=projectId]').val(
			$('#infoForm input[name=id]').val());
	var dataMemberInfo = $('#memberInfoForm').serialize();
	$.post('../../rs/proj/memberinfo/saveMember_update', dataMemberInfo, function(
			result) {
		if (result.code == 200) {
		} else {
		}
	});
}

// 保存计划和任务
function savePlanAndTask() {
	var dataPlanInfo = $('#planInfoForm').serialize();
	$.post('../../rs/proj/planinfo/batchSave', dataPlanInfo, function(result) {
		if (result.code == 200) {
			alert('保存成功');
			$('#modal').modal('hide');
			refreshList();
		}
	});
}
// 保存计划
function savePlan() {
	$('#planInfoTbody input[name=startTime]').removeAttr("disabled");
	$('#planInfoTbody input[name=endTime]').removeAttr("disabled");
	var dataPlanInfo = $('#planInfoForm').serialize();
	$.post('../../rs/proj/planinfo/batchUpdate', dataPlanInfo,
			function(result) {
				if (result.code == 200) {
					alert('修改成功');
					$('#modal').modal('hide');
					refreshList();
				}
			});
}

// 准备删除
function preDel(id) {
	$('input.selectedItem').prop('checked', false);
	$('input[value=' + id + '].selectedItem').prop('checked', true);
}
// 全选
function checkSelect() {
	if ($('input.selectedItem:checked').length == 0) {
		$('#alertModal').modal('show');
	} else {
		$('#delModal').modal('show');
	}
}
// 删除（基本信息，成员，计划，任务，任务进展）
function doDel() {
	var array = [];
	$.each($('input.selectedItem:checked'), function() {
		array.push(this.value);
	});
	$.post('../../rs/proj/info/removeById', {
		ids : array
	}, function(result) {
		$('#delModal').modal('hide');
		refreshList();
	});
}

// 绑定时间控件
function bindDatePicker() {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this,
				type : 'date'
			});
		});
	});
}
//校验权重
function validateWeight(){
	var status;
	var contractId = $('#infoForm input[name=contractId]').val();
	var projectId = $('#infoForm input[name=id]').val();
	var weight = $('#infoForm input[name=weight]').val();
	$.ajax({
		url:'../../rs/proj/info/validateWeight',
		async:false,
		data:{contractId : contractId , projectId : projectId , weight : weight},
		success:function(result){
			if(result.code == 200){
				status = true;
			}else{
				status =  false;
				var infos = result.data;
				var str ="权重不能超过 100%"+"</br>";
				$.each(infos , function(ids,item){
					str += "项目名:"+item.name+" 权重:"+item.weight+"%</br>";
				});
				alert(str);//提示权重错误
			}
		}
	});
	return status;
}
//查询合同金额
function findContractMoney(){
	var projectId = $('#infoForm input[name=id]').val();
	var contractId = $('#infoForm input[name=contractId]').val();
	var weight = $('#infoForm input[name=weight]').val();
	
	var stringAndNum=/^100$|^(\d|[1-9]\d)$/;
    var status = stringAndNum.test(weight);
	
	if(contractId =='' || weight == '' || status != true){
		return ;
	}
	$.get('../../rs/proj/info/findContractMoney', {
		contractId : contractId,
		weight : weight
	}, function(result) {
		$('#infoForm input[name=contractMoney]').val(result);
	});
}

// 标签
function openInfoForm() {
	$('#openInfoForm').parent().attr('class', 'active');
	$('#openMemberInfoForm').parent().attr('class', '');
	$('#openPlanInfoForm').parent().attr('class', '');
	$('#infoForm').attr('style', '');
	$('#memberInfoForm').attr('style', 'display:none;');
	$('#planInfoForm').attr('style', 'display:none;');
}
function openMemberInfoForm() {
	$('#openInfoForm').parent().attr('class', '');
	$('#openMemberInfoForm').parent().attr('class', 'active');
	$('#openPlanInfoForm').parent().attr('class', '');
	$('#infoForm').attr('style', 'display:none;');
	$('#memberInfoForm').attr('style', '');
	$('#planInfoForm').attr('style', 'display:none;');
}
function openPlanInfoForm() {
	$('#openInfoForm').parent().attr('class', '');
	$('#openMemberInfoForm').parent().attr('class', '');
	$('#openPlanInfoForm').parent().attr('class', 'active');
	$('#infoForm').attr('style', 'display:none;');
	$('#memberInfoForm').attr('style', 'display:none;');
	$('#planInfoForm').attr('style', '');
}
