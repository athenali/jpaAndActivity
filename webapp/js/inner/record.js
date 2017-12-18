var table = null;
var currentUserId=null;
var currentUserName=null;
$(function(){
	currentUserId = JSON.parse(sessionStorage.getItem("currentUserAndRole")).userInfo.id;
	currentUserName = JSON.parse(sessionStorage.getItem("currentUserAndRole")).userInfo.username;
	currentDeptId = JSON.parse(sessionStorage.getItem("currentUserAndRole")).userInfo.deptId;
	currentDeptName = JSON.parse(sessionStorage.getItem("currentUserAndRole")).userInfo.deptName;
	currentRoleCode = sessionStorage.getItem("currentUserAndRole");
	
	$("#projectName").autocomplete({
		source : "../../rs/proj/info/findList",
		minLength :1,
		select : function(event, ui) {
			$('#select input[name=projectName]').val(ui.item.lable);
			
		}
	});
	// 日期控件
	layui.use('laydate', function(){
		var laydate = layui.laydate;
		//查询
		laydate.render({
		  elem: '#startDate' 
		});
		laydate.render({
			  elem: '#endDate' 
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
		  ordering: true,
		bLengthChange: false,
		order : [[9, "desc"]],//默认排序字段的索引
		ajax: {
			url: "../../rs/proj/evection/record",
			dataSrc: "data.result"
		},
		serverParams: function (param) {
			var jsonFilter = {
			};
			if (currentRoleCode.indexOf('SYFZC')==-1 && currentRoleCode.indexOf('YLD')==-1) {
				jsonFilter.EQ_deptId = currentDeptId;
			}
			if ($('#projectName').val() != '') {
				jsonFilter.LIKE_projectName = $('#projectName').val();
			}
			if ($('#userName').val() != '') {
				jsonFilter.LIKE_userName = $('#userName').val();
			}
			if ($('#status').val() != '') {
				jsonFilter.EQ_status = $('#status').val();
			}else{
				jsonFilter.NE_status = 'draft';
			}
			if ($('#startDate').val() != '') {
				jsonFilter.GTE_startDate = $('#startDate').val();
			}
			if ($('#endDate').val() != '') {
				jsonFilter.LTE_endDate = $('#endDate').val();
			}if ($('#evectionType').val() != '') {
				jsonFilter.EQ_type = $('#evectionType').val();
			}
			param.jsonFilter = JSON.stringify(jsonFilter);
        },  
        columnDefs: [{ 
        	"orderable": false, "targets": [0,11] //设置tab索引0，11 列不排序
		}],
		columns: [{
			data : 'id',
			render : function(data, type, row,meta){
				return meta.row + 1
			}
		},{
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
		}, {
			data : 'projectName',
			render : function (data , type , row){
				return getTableRow(data,'70px')
				}
		}, {
			data : 'userName'
		}, {
			data : 'evectionUserNames',
			render : function (data , type , row){
				return getTableRow(data,'70px')
				}
		}, {
			data : 'reason'
		}, {
			data : 'departure'
		}, {
			data : 'destination'
		}, {
			data : 'startDate'
		},  {
			data : 'endDate'
		},{
			data : 'status',
			render : function(data ,type ,row){
				var v;
				if(data=="complete"){
					v="审核完成";
				}if(data=="inProgress"){
					v="审核中";
				}if(data=="recal"){
					v="已撤退";
				}
				return v;
			}
		}, {
			data : 'id',
			render: function(data, type, row) {
				return '<a  onclick="findSelect(this)" data-toggle="modal"  class="findLink"  data-id="' + data + '">查看</a>';
			}
		}]
	});
}

function findSelect(obj){
	   var id=$(obj).data('id');
	 sessionStorage.setItem("id", id);
	 $("#content").load("../proj/recordFind.html");
}

function refreshList() {
	table.api().ajax.reload();
}

