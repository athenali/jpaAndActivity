var table = null;
$(function(){
  layui.use('laydate', function(){
		var laydate = layui.laydate;
		lay('.datepicker').each(function(){
	    laydate.render({
	      elem: this
	      ,type: 'date'
	    });
	  });
	});
	// 初始化表格
	initTable();
	// 搜索
	$('#searchBtn').click(refreshList);
  
})

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
			url: "../../rs/proj/info/list",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if ($('#name').val() != '') {
				jsonFilter.LIKE_name = $('#name').val();
			}
			if ($('#startDate').val() != '') {
				jsonFilter.GTE_startDate_DATE = $('#startDate').val();
			}
			if ($('#endDate').val() != '') {
				jsonFilter.LTE_endDate_DATE = $('#endDate').val();
			}
			if ($('#status').val() != '') {
				jsonFilter.EQ_status = $('#status').val();
			}
			if ($('#customerName').val() != '') {
				jsonFilter.LIKE_customerName = $('#customerName').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
		columns: [{
			data : 'id',
			render: function(data, type, row) {
				return '<input type="checkbox" value="' + data + '" class="selectedItem">'
			}
		}, {
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'name',
			render : function(data , type , row){
				return '<a data-toggle="modal" data-target="#viewModal" onclick="proj_info_view(' + row.id + ')" data-id="'
					+ row.id + '">'+data+'</a>';
			}
		}, {
			data : 'customerName'			
		}, {
			data : 'customerManager'
		}, {
			data : 'telephone'
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
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="编写初稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿3.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="提交初稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿2.png"></img>'
					+'<img src="../../img/projectStatus/终稿.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="编写终稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿2.png"></img>'
					+'<img src="../../img/projectStatus/终稿3.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="提交终稿"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿2.png"></img>'
					+'<img src="../../img/projectStatus/终稿2.png"></img>'
					+'<img src="../../img/projectStatus/结束.png"></img>';
				}else if(data=="项目结束"){
					return   '<img src="../../img/projectStatus/合同2.png"></img>'
					+'<img src="../../img/projectStatus/调研2.png"></img>'
					+'<img src="../../img/projectStatus/初稿2.png"></img>'
					+'<img src="../../img/projectStatus/终稿2.png"></img>'
					+'<img src="../../img/projectStatus/结束2.png"></img>';
				}
				return "";
			}
		},{
			data : 'id',
			render: function(data, type, row) {
						return '<a onclick="to_task_list(' + data + ')" data-id="' + data + '">查看任务</a>';
					}
		}]
	});
}
function to_task_list(obj){
	$("#content").load("../proj/task-test-list.html");
}

function refreshList() {
	table.api().ajax.reload();
}

