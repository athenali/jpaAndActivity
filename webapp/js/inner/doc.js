var table = null;
var uri='../../rs/proj/doc/findList_All';//默认领导
var flag = '1';
$(function(){
	if(getRole()=='1'){
		//登录人是领导
	}else{
		flag='0';
		uri='../../rs/proj/doc/findList_All1';
	}
	initTable();
	$('#searchBtn').click(refreshList);
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem : '#rangeDate',
//			type : 'datetime',
//			format : 'yyyy-MM-dd HH:mm:ss',
			range : '~'
		});
	});
})

//获得登录用户角色
function getRole(){
	var flag = '0';
	var currentUserAndRole = JSON.parse(sessionStorage.getItem('currentUserAndRole'));
	var userRoles = currentUserAndRole.userRole;
	$.each(userRoles , function (i,item){
		if(item.code =='SYFZC' || item.code =='YLD'){
			flag = 1;
		}
	});
	return flag;
}
function getUserId(){
	var currentUserAndRole = JSON.parse(sessionStorage.getItem('currentUserAndRole'));
	var userInfo = currentUserAndRole.userInfo;
	return userInfo.id;
}
//查找自己的文档
function controlUser(){
	var ids = [];
	var currentUserAndRole = JSON.parse(sessionStorage.getItem('currentUserAndRole'));
	var userId = currentUserAndRole.userInfo.id;
	$.ajax({
		url:'../../rs/proj/doc/userControl',
		data:{userId : userId},
		async:false,
		dataType:"json",
		success:function(data){
			ids = data.data;
		}
	});
	if(ids.length<1)
		ids.push(-1);
	return ids;
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
		ordering: true,
		bLengthChange: false,
		order : [ [ 5, "desc" ] ],// 默认排序字段的索引
		ajax: {
			url: uri,
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			if(flag=='0'){
				param.userId = getUserId();
				param.flag = $.trim($('#flag').val());
				param.docName = $.trim($('#name').val());
				param.catalog = $('#catalog').val();
				param.customerName = $.trim($('#customerName').val());
				param.projectName = $.trim($('#projectName').val());
				param.userName = $.trim($('#userName').val());
				param.rangeDate = $('#rangeDate').val();
			}else{
				param.docName = $.trim($('#name').val());
				param.catalog = $('#catalog').val();
				param.customerName = $.trim($('#customerName').val());
				param.projectName = $.trim($('#projectName').val());
				param.userName = $.trim($('#userName').val());
				param.rangeDate = $('#rangeDate').val();
			}
        },
        columnDefs : [ {
			"orderable" : false,
			"targets" : [ 0, 6 ]
		} ],
		columns: [
		{
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'fileName',//fileName,
			render: function(data, type, row) {
				return getTableRow(data, '200px');
			}
		}, {
			data : 'pName',
			render: function(data, type, row) {
				return getTableRow(data, '150px');
			}
		}, {
			data : 'cName',
			render: function(data, type, row) {
				return getTableRow(data, '100px');
			}
		}, {
			data : 'username',
		}, {
			data : 'createTime',
		},{
			data : 'path',//style="text-decoration: none;"
			render: function(data, type, row) {
				return '<a  href="../../projectmanage/api/file/download?path='+data+'&name='+row.fileName+'">下载</a>';
				
			}
		}]
	});
}

function refreshList() {
	table.api().ajax.reload();
}

