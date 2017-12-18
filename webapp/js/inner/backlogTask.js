$(function(){
	initTable();
	// 日期控件
	 layui.use('laydate', function(){
			var laydate = layui.laydate;
			lay('.datepicker').each(function(){
		    laydate.render({
		      elem: this
		      ,type: 'date'
		    });
		  });
		});
	// 搜索
	$('#searchBtn').click(refreshList);
})
function controlUser(){
	var userId =  sessionStorage.getItem('currentUserId');
	var ids = [];
	$.ajax({
		url:'../../rs/proj/summary/approver',
		data:{approverId : userId},
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
		ordering: false,
		bLengthChange: false,
		ajax: {
			url: "../../rs/proj/summary/infos",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			var ids = [];
			ids = controlUser();
			jsonFilter.IN_id = ids;
			jsonFilter.EQ_status = '结项申请';
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $('#name').val();
			}
			if ($('#startDate').val() != '') {
				jsonFilter.GTE_startDate = $('#startDate').val();
			}
			if ($('#predictDate').val() != '') {
				jsonFilter.LTE_endDate = $('#predictDate').val();
			}
			if ($('#customerName').val() != '') {
				jsonFilter.LIKE_customerName = $('#customerName').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns: [
		    {
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		}, {
			data : 'name'
		}, {
			data : 'customerName'			
		}, {
			data : 'telephone'
		}, {
			data : 'startDate',
			render : function(data ,type ,row){
				if(data==null){
					return "无";
				}
				return data;
			}
		}, {
			data : 'endDate',
			render : function(data ,type ,row){
				if(data==null){
					return "无";
				}
				return data;
			}
		}, {
			data : 'completeDate',
			render : function(data ,type ,row){
				if(data==null){
					return "无";
				}
				return data;
			}
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
		},{
			data : 'id',
			render: function(data, type, row) {
				return '<a  data-id="' + data + '" onclick="toRecord(this)">结项确认</a>'
			}
		}]
	});
}

function toRecord(obj){
	var id = $(obj).data('id');
	sessionStorage.setItem("infoId", id);
	$("#content").load("../proj/backlogTask-record.html");
}

function refreshList() {
	table.api().ajax.reload();
}