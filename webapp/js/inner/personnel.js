var table;
$(function(){
	//查询部门
	findDeptId();
	//职务
	findPosition();
	initTable();
})

// 获得登录用户角色,事业发展处和院领导是返回1
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
//获取部门Id
function getDeptId(){
	var currentUserAndRole = JSON.parse(sessionStorage
			.getItem('currentUserAndRole'));
	return  currentUserAndRole.userInfo.deptId;
}

function initTable() {
	$.extend(true, $.fn.dataTable.defaults, {
		"language": {
			"url": "../../cdn/public/datatable/Chinese.txt"
		}
	});

	table = $("#table").dataTable(
		{
		retrieve: true,
		searching: false,
		serverSide: true,
		ordering: false,
		bAutoWidth:false,//让自定义表格宽度生效
		bLengthChange:false,//隐藏显示多少条
		ajax: {
			url: "../../rs/proj/user/ListByLeaveAndTravel",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if(getRole()=='0'){//处长查询本部门的人,选择别的部门人员显示空
				var deptId = getDeptId();
				param.deptId = deptId;
				if($('#deptId').val()!=null && $('#deptId').val()!="" && deptId != $('#deptId').val()){
					param.deptId = -1;
				}
				
			}else{//领导
				if ($('#deptId').val() != '') {
					param.deptId = $('#deptId').val();
				}
			}
			if ($('#displayName').val() != '') {
				param.displayName =  $.trim($('#displayName').val());
			}
			if ($('#positionName').val() != '') {
				param.positionName = $('#positionName').val();
			}
			param.leave=$('#leave').val();
			param.travel=$('#travel').val();
		},
		columns: [
		   {
			data : 'displayName'
		},{
			data : 'projectManager',
			render:function(data){
				var html = '';
				if (data.isIdle_List == true) {
					alert("无");
					html = '无';
				} else {
					var chuchai = data.investigationCountDTO;
					var chugao = data.firstDraftDTO;
					var zhonggao = data.finalDraftDTO;
					$.each(chuchai,function(idx,item){
						html += item.projectName+"-"+item.name;
					});
					$.each(chugao,function(idx,item){
						html += item.projectName+"-"+item.name;
					});
					$.each(zhonggao,function(idx,item){
						html += item.projectName+"-"+item.name;
					});
				}
				return html;
			}
		}, {
			data: 'projectRelationship',
			render: function(data) {
				var html = '';
				if (data.idle === true) {
					html = '空闲';
				} else {
					if (data.investigationCount != 0) {
						html += '调研(' + data.investigationCount + ')<br>'
					}
					if (data.firstDraftCount != 0) {
						html += '初稿(' + data.firstDraftCount + ')<br>'
					}
					if (data.finalDraftCount != 0) {
						html += '终稿(' + data.finalDraftCount + ')'
					}
				}
				return html;
			}
		}, {
			data: 'leave',
			render: function(data){
				if(data=='是'){
					return "<span style='color: #1cd11d;'>是</span>";
				}else{
					return "否";
				}
			}
		}, {
			data: 'travel',
			render: function(data){
				if(data=='是'){
					return "<span style='color: #1cd11d;'>是</span>";
				}else{
					return "否";
				}
			}
		}, {
			data: 'travelAddress'
		}, {
			data: 'travel',
			render: function(data, type, row) {
				if (row.travel == '否') {
					return '';
				} else {
					return row.travelStartDate + '至' + row.travelEndDate;
				}
			}
		}]
	});
}
function refreshList() {
	table.api().ajax.reload();
}
// 查询部门列表
function findDeptId(){
	var deptId = $('#deptId');
	$.post('../../rs/proj/dept/findAll', {}, function(result) {
		deptId.append('<option value="">请选择</option>');
		var list = result.data.result;
		for(var i = 0; i < list.length; i++) {
			deptId.append(
				"<option value='" + list[i].id + "'>" + list[i].name + "</option>"
			);
		}
	});
}
//职务
function findPosition(){
	$.post('../../rs/proj/dict/findByTypeCode', {
		typeCode: 'position'	
	}, function(result) {
		$('#positionName').html('<option value="">请选择</option>');
		var list = result.data;
		$.each(list, function(index, item) {
			$('#positionName').append(
				"<option value='" + item.name + "'>" + item.name + "</option>"
			);
		});
	});
}