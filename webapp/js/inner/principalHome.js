var currentUserId = null;
var contractTable = null;
var moneytables = null;
var scheduleTables = null;
$(function() {
			currentUserId = sessionStorage.getItem("currentUserId");
			// 初始化表格
			contractTalkingTable();
			moneyTable();
			scheduleTable();

			$("#moneyTable").hide();
			$("#scheduleTable").hide();
			contractNum();
		});
$("#money").click(function() {
			$("#moneyTable").show();
			$("#contractTable").hide();
			$("#scheduleTable").hide();
		})
$("#contract").click(function() {
			$("#contractTable").show();
			$("#moneyTable").hide();
			$("#scheduleTable").hide();
		})
$("#schedule").click(function() {
			$("#scheduleTable").show();
			$("#moneyTable").hide();
			$("#contractTable").hide();
		})
$("#talkings").click(function() {
	contractTable.api().ajax
			.url("../../rs/proj/contract/principalHomelist?status=洽谈中&userId="
					+ currentUserId).load();
})
$("#signs").click(function() {
	contractTable.api().ajax
			.url("../../rs/proj/contract/principalHomelist?status=已签订&userId="
					+ currentUserId).load();
})
$("#stops").click(function() {
	contractTable.api().ajax
			.url("../../rs/proj/contract/principalHomelist?status=机会终止&userId="
					+ currentUserId).load();
})
$("#ok").click(function() {
	moneytables.api().ajax
			.url("../../projectmanage/api/salesBack/principalHomelist1?userId="
					+ currentUserId).load();
})
$("#no").click(function() {
	moneytables.api().ajax
			.url("../../projectmanage/api/salesBack/principalHomelist2?userId="
					+ currentUserId).load();
})
$("#contractsigns").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=合同签订&userId="
					+ currentUserId).load();
})
$("#surveys").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=出差调研&userId="
					+ currentUserId).load();
})
$("#surveysFin").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=调研完成&userId="
					+ currentUserId).load();
})
$("#writeDrafts").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=编写初稿&userId="
					+ currentUserId).load();
})
$("#drafts").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=提交初稿&userId="
					+ currentUserId).load();
})
$("#writeFinaldrafts").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=编写终稿&userId="
					+ currentUserId).load();
})
$("#finaldrafts").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=提交终稿&userId="
					+ currentUserId).load();
})
$("#finishs").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist1?status=项目结束&userId="
					+ currentUserId).load();
})
$("#contractimg").click(function() {
	contractTable.api().ajax
			.url("../../rs/proj/contract/principalHomelist?status=已签订&userId="
					+ currentUserId).load();

})
$("#moneyimg").click(function() {
	moneytables.api().ajax
			.url("../../projectmanage/api/salesBack/principalHomelist1?userId="
					+ currentUserId).load();

})
$("#scheduleimg").click(function() {
	scheduleTables.api().ajax
			.url("../../rs/proj/info/principalHomelist?userId=" + currentUserId)
			.load();

})

function contractTalkingTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	contractTable = $("#contractTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : false,
		bAutoWidth : true,
		bLengthChange : false,
		order : [[6, "desc"]],// 默认排序字段的索引
		ajax : {
			url : "../../rs/proj/contract/principalHomelist?status=已签订&userId="
					+ currentUserId,
			dataSrc : "data"
		},
		columnDefs : [{
					"orderable" : false,
					"targets" : [0, 7]
				}],
		columns : [{
					data : 'projectName',
					render : function(data) {
						return getTableRow(data, '150px');
					}
				}, {
					data : 'name',
					render : function(data) {
						return getTableRow(data, '150px');
					}
				}, {
					data : 'type'
				}, {
					data : 'contractNumber'
				}, {
					data : 'createTime'
				}, {
					data : 'contractAmount'
				}, {
					data : 'registerDate'
				}, {
					data : 'status'
				}]
	});
}
function moneyTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	moneytables = $("#moneyTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : false,
		bAutoWidth : false,
		bLengthChange : false,
		ajax : {
			url : "../../projectmanage/api/salesBack/principalHomelist1?userId="
					+ currentUserId,
			dataSrc : "data.result"
		},
		columns : [{
					data : 'name'
				}, {
					data : 'projectType'
				}, {
					data : 'managerName'
				}, {
					data : 'remittanceAmount'
				}, {
					data : 'contractAmount'
				}]
	});
}
function scheduleTable() {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	scheduleTables = $("#scheduleTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : true,
		bAutoWidth : false,
		bLengthChange : false,
		ajax : {
			url : "../../rs/proj/info/principalHomelist1?status=&userId="
					+ currentUserId,
			dataSrc : "data.result"
		},
		columns : [{
					data : 'name'
				}, {
					data : 'projectType'
				}, {
					data : 'managerName'
				}, {
					data : 'createUserName'
				}, {
					data : 'needExpert'
				}, {
					data : 'status'
				}]
	});
}

function contractNum() {
	$.get(	"../../rs/proj/contract/principalHomelist?status=洽谈中&userId="
					+ currentUserId, function(data) {
				$('#talking').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/contract/principalHomelist?status=已签订&userId="
					+ currentUserId, function(data) {
				$('#sign').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/contract/principalHomelist?status=机会终止&userId="
					+ currentUserId, function(data) {
				$('#stop').html(data.recordsTotal);
			});
	$.get(	"../../projectmanage/api/salesBack/principalHomelist1?userId="
					+ currentUserId, function(data) {
				$('#moneyok').html(data.recordsTotal);
			});
	$.get(	"../../projectmanage/api/salesBack/principalHomelist2?userId="
					+ currentUserId, function(data) {
				$('#moneyno').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=合同签订&userId="
					+ currentUserId, function(data) {
				$('#contractsign').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=出差调研&userId="
					+ currentUserId, function(data) {
				$('#survey').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=调研完成&userId="
					+ currentUserId, function(data) {
				$('#surveysFins').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=编写初稿&userId="
					+ currentUserId, function(data) {
				$('#writeDraft').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=提交初稿&userId="
					+ currentUserId, function(data) {
				$('#draft').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=编写终稿&userId="
					+ currentUserId, function(data) {
				$('#writeFinaldraft').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=提交终稿&userId="
					+ currentUserId, function(data) {
				$('#finaldraft').html(data.recordsTotal);
			});
	$.get(	"../../rs/proj/info/principalHomelist1?status=项目结束&userId="
					+ currentUserId, function(data) {
				$('#finish').html(data.recordsTotal);
			});

}
