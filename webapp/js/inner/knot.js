$(function() {
	initTable();
	// 日期控件

	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay('.datepicker').each(function() {
			laydate.render({
				elem : this,
				type : 'date'
			});
		});
	});
	// 搜索
	$('#searchBtn').click(refreshList);
	$("FORM#summaryForm").validate({
		errorClass : 'validate-error'
	});

	// 撤销
	// $('#withdrawBtn').click(doWithdrawBtn);
})

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
						order : [ [ 7, "desc" ] ],// 默认排序字段的索引
						ajax : {
							url : "../../rs/proj/info/list",
							dataSrc : "data.result"
						},
						serverParams : function(param) {
							var jsonFilter = {};
							var currentUserAndRole = JSON.parse(sessionStorage
									.getItem('currentUserAndRole'));
							var userId = currentUserAndRole.userInfo.id;
							jsonFilter.EQ_managerId = userId;
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
							"targets" : [ 0, 8 ]
						} ],
						columns : [
								{
									data : 'id',
									render : function(data, type, row, meta) {
										return meta.row + 1
									}
								},
								{
									data : 'name',
									render : function(data) {
										return getTableRow(data, '150px');
									}
								}, 
								{
									data : 'customerName',
									render : function(data) {
										return getTableRow(data, '100px');
									}
								},
								{
									data : 'startDate',
									render : function(data, type, row) {
										if (data == null) {
											return "无";
										}
										return data;
									}
								},
								{
									data : 'endDate',
									render : function(data, type, row) {
										if (data == null) {
											return "无";
										}
										return data;
									}
								},
								{
									data : 'completeDate',
									render : function(data, type, row) {
										if (data == null) {
											return "无";
										}
										return data;
									}
								},
								{
									data : 'status',
									render : function(data, type, row) {
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
								},
								{
									data : 'createTime'
								},
								{
									data : 'id',
									render : function(data, type, row) {
										if (row.status == '提交终稿') {
											return '<a  data-id="' + data + '" onclick="toRecord(this)">申请结项</a>'
										} else if (row.status == '结项申请') {
											return '';
										} else {
											return '';
										}
									}
								} ]
					});
}

function toRecord(obj) {
	var id = $(obj).data('id');
	sessionStorage.setItem("infoId", id);
	$("#content").load("../proj/knot-record.html");
}

function refreshList() {
	table.api().ajax.reload();
}

function preWithdraw(obj) {
	$('#withdrawModal').data('summaryid', $(obj).data('summaryid'));
}

function doWithdrawBtn() {
	$.post('../../rs/proj/summary/withdraw', {
		id : $('#withdrawModal').data('summaryid')
	}, function(data) {
		$('#withdrawModal').modal('hide');
		refreshList();
	});
}
