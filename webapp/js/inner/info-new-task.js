var table = null;
var memberTable = null;
var expertTable = null;

$(function(){
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this,
				type : 'date'
			});
		});
	});
  
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
})

function controlUser(){
	var userId = sessionStorage.getItem('currentUserId');
	var ids = [];
	$.ajax({
		url:'../../rs/proj/info/userControl',
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
	//配置DataTables默认参数
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
		order : [[6, "desc"]],//默认排序字段的索引
		ajax: {
			url: "../../rs/proj/info/list",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			var ids = [];
			ids = controlUser();
			jsonFilter.IN_id = ids;
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
        columnDefs: [
	        { 
	        	"orderable": false, "targets": [0,8] //设置不排序的列 从0开始
	        }
        ],
		columns: [{
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'name',
			render : function(data , type , row){
				return getTableRow(data,'150px')
			}
		}, {
			data : 'customerName',
			render : function(data,type,row){ 
				return getTableRow(data,'100px');
			}
		}, {
			data : 'startDate'
		}, {
			data : 'endDate'
		}, {
			data : 'status',
			render : function(data , type , row){
				if(data=="合同签订"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
						+'<img src="../../img/projectStatus/调研.png"></img>'
						+'<img src="../../img/projectStatus/初稿.png"></img>'
						+'<img src="../../img/projectStatus/终稿.png"></img>'
						+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="出差调研"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研3.png"></img>'
					+'<img src="../../img/projectStatus/初稿.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="调研完成"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="编写初稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿3.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="提交初稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿'+(row.overTimeCG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="编写终稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿'+(row.overTimeCG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/终稿3.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="提交终稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿'+(row.overTimeCG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/终稿'+(row.overTimeZG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="结项申请"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿'+(row.overTimeCG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/终稿'+(row.overTimeZG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/结束3.png"></img>';
				}else if(data=="项目结束"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研'+(row.overTimeDY=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/初稿'+(row.overTimeCG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/终稿'+(row.overTimeZG=="超时"?4:2)+'.png"></img>'
					+'<img src="../../img/projectStatus/结束2.png"></img>';
				}
				return "";
			}
		}, {
			data : 'createTime'
		},{
			data : 'managerId',
			render: function(data, type, row) {
				var userId = sessionStorage.getItem('currentUserId');
				if(userId==data){
					return '<span style="color: #1cd11d;">我负责的</span>';
				}else if(userId==row.createUserId){
					return '<span style="color: #fc0;">我创建的</span>';
				}else{
					return '<span>我参与的</span>';
				}
				return '';
			}
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a onclick="show(this)" data-id="' + data + '">查看进度</a>';
			}
		}]
	});
}

function getTableA(data,width,click){
	if(click==null){
		return '<a style="width:'+width+';word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title = '+data+';>'+data+'</a>'
	}else{
		return '<a onclick='+click+' style="width:'+width+';word-break: keep-all;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title = '+data+';>'+data+'</a>'
	}
}
function show(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("projId", id);
	$('#content').load('../proj/task-list.html');
}
function refreshList() {
	table.api().ajax.reload();
}