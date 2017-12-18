var table = null;
var memberTable = null;
var expertTable = null;

$(function(){
	// 自定补全项目名称
	$("#name").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength :1,
		select : function(event, ui) {
			$('#select input[name=name]').val(ui.item.lable);
			
		}
	});
	
	
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
	// 全选
	$('#selectAll').click(selectAll);
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
		ordering: true,
		bLengthChange: false,
		order : [[3, "desc"]],//默认排序字段的索引
		ajax: {
			url: "../../rs/proj/seo/processSelect",
			dataSrc: "data"
		},
		serverParams: function (param) {
			
			if ($('#name').val() != '') {
				param.projectName=$('#name').val();
			}
			if ($('#startDate').val() != '') {
				param.startDate= $('#startDate').val();
			}if ($('#endDate').val() != '') {
				param.endDate= $('#endDate').val();
			}
			if ($('#status').val() != '') {
				param.status= $('#status').val();
			}
        },   columnDefs: [{ 
        	"orderable": false, "targets": [0,5,6,7,8] //设置tab索引0，11 列不排序
		}],
		columns: [{
			data : 'id',
			render : function(data, type, row) {
				return '<input type="checkbox" value="'
						+ data
						+ '" class="selectedItem"  name="selectedItem">'
			}
		},{
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
			data : 'name',
			render : function (data , type , row){
				return getTableRow(data,'100px')
				}
		},{
			data : 'manager',	
		}, 
	/*	{
			data : 'contractMoney'		
			
		}, {
			data : 'remiCount'			
		}, */
		{
			data : 'startDate',
		}, {
			data : 'endDate',
		},{
			data : 'resultDateCG'
		}, {
			data : 'resultDateZG'
		}, {
			data : 'inresultDateCG'
		},{
			data : 'inresultDateZG'
		},{
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
		}]
	});
}
function selectAll() {
	$('input.selectedItem').prop('checked', $(this).prop('checked'));
}
function show(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("projId", id);
	$('#content').load('../proj/task-list.html');
}
function refreshList() {
	table.api().ajax.reload();
}
function exportBtn(){
	var orderColumn = "startDate";
	var orderDir = "desc"
	// 排序的列
	var order = table.api().order();
	var orderNum = order[0][0];
	orderDir = order[0][1];
	switch (orderNum) {
	case 1:
		orderColumn = "name";
		break;
	case 2:
		orderColumn = "manager";
		break;
	case 3:
		orderColumn = "contractMoney";
		break;
	case 4:
		orderColumn = "remiCount";
		break;
	case 5:
		orderColumn = "startDate";
		break;
	case 6:
		orderColumn = "endDate";
		break;
	case 11:
		orderColumn = "status";
		break;
	default:
	}
	var array = [];
	$.each($('input.selectedItem:checked'), function() {
		array.push(this.value);
	});
		var projectName = $('#name').val();
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		var status = $('#status').val();	
	forwardTo('../../rs/proj/seo/processexcel?projectName='+projectName+'&startDate='+startDate+'&endDate='+endDate+'&status='+status+"&orderDir=" + orderDir + "&orderColumn=" +orderColumn+ "&projectIds=" +array);

}

function exportZouBaoExcel() {
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	forwardTo('../../rs/proj/contract/excel?startTime=' + startDate
			+ '&endTime=' + endDate);
}







