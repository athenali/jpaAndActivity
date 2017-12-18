var currentUserId = sessionStorage.getItem("currentUserId");
var contractSignsTable = null;
var constractTalksTable = null;
var constractStopsTable = null;
var moneyAlreadysTable = null;
var moneyPartsTable = null;
var moneyNosTable = null;
var projectAllsTable = null;
var projectEvectionsTable = null;
var projectDraftsTable = null;
var projectFinalsTable = null;
var projectEndsTable = null;
var userTable = null;
var userEvectionTable = null;
var userLeaveTable = null;
var projectAllUrl = null;
var projectEvectionUrl = null;
var projectDraftUrl = null;
var projectFinalUrl = null;
var projectEndUrl = null;
var contractSignUrl = null;
var constractTalkUrl = null;
var constractStopUrl = null;
var moneyAlreadyUrl = null;
var moneyPartUrl = null;
var moneyNoUrl = null;
var personUrl = null;
var personEvectionUrl = null;
var personLeaveUrl = null;
$(function() {
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					// 初始化表格
					projectAllUrl = "../../rs/proj/info/list";
					projectEvectionUrl = "../../rs/proj/info/list1?status="
							+ encodeURI("出差调研");
					projectDraftUrl = "../../rs/proj/info/list1?status="
							+ encodeURI("提交初稿");
					projectFinalUrl = "../../rs/proj/info/list1?status="
							+ encodeURI("提交终稿");
					projectEndUrl = "../../rs/proj/info/list1?status="
							+ encodeURI("项目结束");
					contractSignUrl = "../../rs/proj/contract/list1";
					constractTalkUrl = "../../rs/proj/contract/list2?status="
							+ encodeURI("洽谈中");
					constractStopUrl = "../../rs/proj/contract/list2?status="
							+ encodeURI("机会终止");
					moneyAlreadyUrl = "../../projectmanage/api/salesBack/salesQuery?status="
							+ encodeURI("已回款");
					moneyPartUrl = "../../projectmanage/api/salesBack/salesQuery?status="
							+ encodeURI("部分回款");
					moneyNoUrl = "../../projectmanage/api/salesBack/salesQuery?status="
							+ encodeURI("未回款");
					personUrl = "../../rs/proj/user/infos3";
					personEvectionUrl = "../../rs/proj/user/infos2?status="
							+ encodeURI("出差");
					personLeaveUrl = "../../rs/proj/user/infos2?status="
							+ encodeURI("休假");
					contractSignTable(contractSignUrl);
					contractNum();
					$("#contractSigningtTable").show();

				}
				if (parseInt(data.data) == parseInt(2)) {
					projectAllUrl = "../../rs/proj/info/principalHomelist1?status=&userId="
							+ currentUserId;
					projectEvectionUrl = "../../rs/proj/info/principalHomelist1?status="
							+ encodeURI("出差调研") + "&userId=" + currentUserId;
					projectDraftUrl = "../../rs/proj/info/principalHomelist1?status="
							+ encodeURI("提交初稿") + "&userId=" + currentUserId;
					projectFinalUrl = "../../rs/proj/info/principalHomelist1?status="
							+ encodeURI("提交终稿") + "&userId=" + currentUserId;
					projectEndUrl = "../../rs/proj/info/principalHomelist1?status="
							+ encodeURI("项目结束") + "&userId=" + currentUserId;
					contractSignUrl = "../../rs/proj/contract/principalHomelist?userId="
							+ currentUserId;
					constractTalkUrl = "../../rs/proj/contract/list3?status="
							+ encodeURI("洽谈中") + "&userId=" + currentUserId;
					constractStopUrl = "../../rs/proj/contract/list3?status="
							+ encodeURI("机会终止") + "&userId=" + currentUserId;
					moneyAlreadyUrl = "../../projectmanage/api/salesBack/salesQuery2?status="
							+ encodeURI("已回款") + "&userId=" + currentUserId;
					moneyPartUrl = "../../projectmanage/api/salesBack/salesQuery2?status="
							+ encodeURI("部分回款") + "&userId=" + currentUserId;
					moneyNoUrl = "../../projectmanage/api/salesBack/salesQuery2?status="
							+ encodeURI("未回款") + "&userId=" + currentUserId;
					// 初始化表格
					contractSignTable(contractSignUrl);
					LeaderProjNum();
					$("#contractSigningtTable").show();
					$("#totalMoneys").hide();
					$("#totalNumbers").hide();

					$("#p").hide();
					$("#c").attr("class", "col-xs-4");
					$("#m").attr("class", "col-xs-4");
					$("#s").attr("class", "col-xs-4");
					$("#signs,#stops,#totalMoneys,#totalNumbers").css({
								"margin-top" : "2%"
							});
					$("#titleC").css({
								"margin-top" : "-21%",
								"margin-left" : "-8%"

							});
					$("#titleM,#titleS").css({
								"margin-top" : "-20.5%",
								"margin-left" : "-7%"

							});
					$("#moneypart").css({
								"margin-left" : "19%"

							});
					$("#ok,#surveys").css({
								"margin-top" : "3%",
								"margin-left" : "3%"

							});
					$("#part,#no,#drafts,#finaldrafts,#finishs").css({
								"margin-top" : "2%"

							});
					$("#talkings").css({
								"margin-top" : "3%"

							});
					$("#stop").css({
								"margin-left" : "18.8%"

							});
					$("#contractimg").css({
								"margin-left" : "78%",
								"margin-top" : "2%"

							});
					$("#moneyimg,#scheduleimg").css({
								"margin-left" : "78%",
								"margin-top" : "3%"

							});
				}
				if (parseInt(data.data) == parseInt(3)) {
					projectAllUrl = "../../rs/proj/info/principalHomelist?status=&userId="
							+ currentUserId;
					projectEvectionUrl = "../../rs/proj/info/principalHomelist?status="
							+ encodeURI("出差调研") + "&userId=" + currentUserId;
					projectDraftUrl = "../../rs/proj/info/principalHomelist?status="
							+ encodeURI("提交初稿") + "&userId=" + currentUserId;
					projectFinalUrl = "../../rs/proj/info/principalHomelist?status="
							+ encodeURI("提交终稿") + "&userId=" + currentUserId;
					projectEndUrl = "../../rs/proj/info/principalHomelist?status="
							+ encodeURI("项目结束") + "&userId=" + currentUserId;
					projectAllTable(projectAllUrl);
					projectEvectionTable(projectEvectionUrl);
					projectDraftTable(projectDraftUrl);
					projectFinalTable(projectFinalUrl);
					projectEndTable(projectEndUrl);
					staffProjNum();
					$("#projectAllingTable").show();
					$("#p").hide();
					$("#c").hide();
					$("#m").hide();
					$("#s").attr("class", "col-xs-12");
					$("#scheduleimg").css({
								"margin-left" : "92%",
								"margin-top" : "1%"

							});
					$("#titleS").css({
								"margin-top" : "-5.6%",
								"margin-left" : "2%"

							});
					$("#surveys").css({
								"margin-top" : "2%",
								"margin-left" : "2%"

							});
					$("#drafts,#finaldrafts,#finishs").css({
								"margin-top" : "1%",
								"margin-left" : "2%"

							});
				}
			});

});
$("#totalMoneys").click(function() {
			event.stopPropagation();
		})
$("#totalNumbers").click(function() {
			event.stopPropagation();
		})
$("#talkings").click(function() {
	$("#contractTalkingTable").show();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					constractTalkTable(constractTalkUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					constractTalkTable(constractTalkUrl);
				}
			})
})
$("#signs").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").show();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					contractSignTable(contractSignUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					contractSignTable(contractSignUrl);
				}
			})
})
$("#stops").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").show();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					constractStopTable(constractStopUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					constractStopTable(constractStopUrl);
				}
			})
})
$("#ok").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").show();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(2)) {
					moneyAlreadyTable(moneyAlreadyUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					moneyAlreadyTable(moneyAlreadyUrl);
				}
			})
})
$("#part").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").show();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					moneyPartTable(moneyPartUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					moneyPartTable(moneyPartUrl);
				}
			})
})
$("#no").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").show();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					moneyNoTable(moneyNoUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					moneyNoTable(moneyNoUrl);
				}
			})
})
$("#surveys").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").show();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(3)) {
					projectEvectionTable(projectEvectionUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					projectEvectionTable(projectEvectionUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					projectEvectionTable(projectEvectionUrl);
				}
			});
})
$("#drafts").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").show();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(3)) {
					projectDraftTable(projectDraftUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					projectDraftTable(projectDraftUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					projectDraftTable(projectDraftUrl);
				}
			});
})
$("#finaldrafts").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").show();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(3)) {
					projectFinalTable(projectFinalUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					projectFinalTable(projectFinalUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					projectFinalTable(projectFinalUrl);
				}
			});
})
$("#finishs").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").show();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(3)) {
					projectEndTable(projectEndUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					projectEndTable(projectEndUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					projectEndTable(projectEndUrl);
				}
			});
})
$("#evection").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").show();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					personEvectionTable(personEvectionUrl);
				}
			})
})
$("#leave").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").show();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					personLeaveTable(personLeaveUrl);
				}
			})
})
$("#contractimg").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").show();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					contractSignTable(contractSignUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					contractSignTable(contractSignUrl);
				}
			})
})
$("#moneyimg").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").show();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					moneyAlreadyTable(moneyAlreadyUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					moneyAlreadyTable(moneyAlreadyUrl);
				}
			})
})
$("#scheduleimg").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").show();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").hide();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(3)) {
					projectAllTable(projectAllUrl);
				}
				if (parseInt(data.data) == parseInt(1)) {
					projectAllTable(projectAllUrl);
				}
				if (parseInt(data.data) == parseInt(2)) {
					projectAllTable(projectAllUrl);
				}
			});

})
$("#peopleimg").click(function() {
	$("#contractTalkingTable").hide();
	$("#contractSigningtTable").hide();
	$("#contractStopingTable").hide();
	$("#moneyAlreadyingTable").hide();
	$("#moneyPartingTable").hide();
	$("#moneyNoingTable").hide();
	$("#projectAllingTable").hide();
	$("#projectEvectioningTable").hide();
	$("#projectDraftingTable").hide();
	$("#projectFinalingTable").hide();
	$("#projectEndingTable").hide();
	$("#peopleTable").show();
	$("#peopleEvectionTable").hide();
	$("#peopleLeaveTable").hide();
	$.get("../../rs/proj/user/currentUserInfo?userId=" + currentUserId,
			function(data) {
				if (parseInt(data.data) == parseInt(1)) {
					personTable(personUrl);
				}
			})

})

function contractSignTable(contractSignUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	contractSignsTable = $("#contractSignTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				idisplaylength : 10,
				bLengthChange : false,
				ajax : {
					url : contractSignUrl,
					dataSrc : "data.result"
				},
				columns : [{
							data : 'contractNumber',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'name',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'payOne'
						}, {
							data : 'payTwo'
						}, {
							data : 'payThree'
						}, {
							data : 'registerDate'
						}, {
							data : 'createTime'
						}]
			});
}
function constractTalkTable(constractTalkUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	constractTalksTable = $("#contractTalkingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : true,
				bLengthChange : false,
				ajax : {
					url : constractTalkUrl,
					dataSrc : "data.result"
				},
				columns : [{
							data : 'projectName',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'projectType',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'leader'
						}, {
							data : 'customerName',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'projectClue'
						}, {
							data : 'telephone'
						}, {
							data : 'status'
						}]
			});
}
function constractStopTable(constractStopUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	constractStopsTable = $("#contractStopingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : true,
				bLengthChange : false,
				ajax : {
					url : constractStopUrl,
					dataSrc : "data.result"
				},
				columns : [{
							data : 'projectName',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'projectType',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'leader'
						}, {
							data : 'customerName',
							render : function(data) {
								return getTableRow(data, '150px');
							}
						}, {
							data : 'projectClue'
						}, {
							data : 'telephone'
						}, {
							data : 'status'
						}]
			});
}
function moneyAlreadyTable(moneyAlreadyUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	moneyAlreadysTable = $("#moneyAlreadyingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : moneyAlreadyUrl,
					dataSrc : "data"
				},
				columns : [{
							data : 'proName',
							render : function(data, type, row) {
								return getTableRow(data, '130px')
							}
						}, {
							data : 'proLader'
							,
						}, {
							data : 'customerName',
							render : function(data, type, row) {
								return getTableRow(data, '100px')
							}
						}, {
							data : 'projectType'
							,
						}, {
							data : 'time'
							,
						}, {
							data : 'contractAmount'
						}, {
							data : 'remiCount'
						}, {
							data : 'noRemiCount'
						}]
			});
}
function moneyPartTable(moneyPartUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	moneyPartsTable = $("#moneyPartingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : moneyPartUrl,
					dataSrc : "data"
				},
				columns : [{
							data : 'proName',
							render : function(data, type, row) {
								return getTableRow(data, '130px')
							}
						}, {
							data : 'proLader'
							,
						}, {
							data : 'customerName',
							render : function(data, type, row) {
								return getTableRow(data, '100px')
							}
						}, {
							data : 'projectType'
							,
						}, {
							data : 'time'
							,
						}, {
							data : 'contractAmount'
						}, {
							data : 'remiCount'
						}, {
							data : 'noRemiCount'
						}]
			});
}
function moneyNoTable(moneyNoUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	moneyNosTable = $("#moneyNoingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : moneyNoUrl,
					dataSrc : "data"
				},
				columns : [{
							data : 'proName',
							render : function(data, type, row) {
								return getTableRow(data, '130px')
							}
						}, {
							data : 'proLader'
							,
						}, {
							data : 'customerName',
							render : function(data, type, row) {
								return getTableRow(data, '100px')
							}
						}, {
							data : 'projectType'
							,
						}, {
							data : 'time'
							,
						}, {
							data : 'contractAmount'
						}, {
							data : 'remiCount'
						}, {
							data : 'noRemiCount'
						}]
			});
}
function projectAllTable(projectAllUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	projectAllsTable = $("#projectAllingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : projectAllUrl,
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
function projectEvectionTable(projectEvectionUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	projectEvectionsTable = $("#projectEvectioningTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : projectEvectionUrl,
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
function projectDraftTable(projectDraftUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	projectDraftsTable = $("#projectDraftingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : projectDraftUrl,
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
function projectFinalTable(projectFinalUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	projectFinalsTable = $("#projectFinalingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : projectFinalUrl,
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
function projectEndTable(projectEndUrl) {
	// 配置DataTables默认参数
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	projectEndsTable = $("#projectEndingTables").dataTable({
				retrieve : true,
				searching : false,
				serverSide : true,
				ordering : false,
				bAutoWidth : false,
				bLengthChange : false,
				ajax : {
					url : projectEndUrl,
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

function personTable(personUrl) {
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	userTable = $("#peopleTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : false,
		bAutoWidth : false,// 让自定义表格宽度生效
		bLengthChange : false,// 隐藏显示多少条
		ajax : {
			url : personUrl,
			dataSrc : "data.result"
		},
		columns : [{
					data : 'displayName'
				}, {
					data : 'projectManager',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '无';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'projectRelationship',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '空闲';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'leave'
				}, {
					data : 'travel'
				}, {
					data : 'travelAddress'
				}, {
					data : 'travel',
					render : function(data, type, row) {
						if (row.travel == '否') {
							return '';
						} else {
							return row.travelStartDate + '至'
									+ row.travelEndDate;
						}
					}
				}]
	});
}
function personEvectionTable(personEvectionUrl) {
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	userEvectionTable = $("#peopleEvectionTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : false,
		bAutoWidth : false,// 让自定义表格宽度生效
		bLengthChange : false,// 隐藏显示多少条
		ajax : {
			url : personEvectionUrl,
			dataSrc : "data.result"
		},
		columns : [{
					data : 'displayName'
				}, {
					data : 'projectManager',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '无';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'projectRelationship',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '空闲';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'leave'
				}, {
					data : 'travel'
				}, {
					data : 'travelAddress'
				}, {
					data : 'travel',
					render : function(data, type, row) {
						if (row.travel == '否') {
							return '';
						} else {
							return row.travelStartDate + '至'
									+ row.travelEndDate;
						}
					}
				}]
	});
}
function personLeaveTable(personLeaveUrl) {
	$.extend(true, $.fn.dataTable.defaults, {
				"language" : {
					"url" : "../../cdn/public/datatable/Chinese.txt"
				}
			});
	userLeaveTable = $("#peopleLeaveTables").dataTable({
		retrieve : true,
		searching : false,
		serverSide : true,
		ordering : false,
		bAutoWidth : false,// 让自定义表格宽度生效
		bLengthChange : false,// 隐藏显示多少条
		ajax : {
			url : personLeaveUrl,
			dataSrc : "data.result"
		},
		columns : [{
					data : 'displayName'
				}, {
					data : 'projectManager',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '无';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'projectRelationship',
					render : function(data) {
						var html = '';
						if (data.idle === true) {
							html = '空闲';
						} else {
							if (data.investigationCount != 0) {
								html += '调研(' + data.investigationCount
										+ ')<br>'
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
					data : 'leave'
				}, {
					data : 'travel'
				}, {
					data : 'travelAddress'
				}, {
					data : 'travel',
					render : function(data, type, row) {
						if (row.travel == '否') {
							return '';
						} else {
							return row.travelStartDate + '至'
									+ row.travelEndDate;
						}
					}
				}]
	});
}

function staffProjNum() {
	$.get(projectEvectionUrl, function(data) {
				$('#survey').html(data.data.totalCount);
			});
	$.get(projectDraftUrl, function(data) {
				$('#draft').html(data.data.totalCount);
			});
	$.get(projectFinalUrl, function(data) {
				$('#finaldraft').html(data.data.totalCount);
			});
	$.get(projectEndUrl, function(data) {
				$('#finish').html(data.data.totalCount);
			});
}
function LeaderProjNum() {
	$.get(constractTalkUrl, function(data) {
				$('#talking').html(data.recordsTotal);
			});
	$.get(contractSignUrl, function(data) {
				$('#sign').html(data.data.totalCount);
			});
	$.get(constractStopUrl, function(data) {
				$('#stop').html(data.recordsTotal);
			});
	$.get(moneyAlreadyUrl, function(data) {
				$('#moneyok').html(data.recordsTotal);
			});
	$.get(moneyPartUrl, function(data) {
				$('#moneypart').html(data.recordsTotal);
			});
	$.get(moneyNoUrl, function(data) {
				$('#moneyno').html(data.recordsTotal);
			});
	$.get(projectEvectionUrl, function(data) {
				$('#survey').html(data.data.totalCount);
			});
	$.get(projectDraftUrl, function(data) {
				$('#draft').html(data.data.totalCount);
			});
	$.get(projectFinalUrl, function(data) {
				$('#finaldraft').html(data.data.totalCount);
			});
	$.get(projectEndUrl, function(data) {
				$('#finish').html(data.data.totalCount);
			});
}

function contractNum() {
	$.get(constractTalkUrl, function(data) {
				$('#talking').html(data.recordsTotal);
			});
	$.get(contractSignUrl, function(data) {
				$('#sign').html(data.data.totalCount);
			});
	$.get(constractStopUrl, function(data) {
				$('#stop').html(data.recordsTotal);
			});
	$.get(moneyAlreadyUrl, function(data) {
				$('#moneyok').html(data.recordsTotal);
			});
	$.get(moneyPartUrl, function(data) {
				$('#moneypart').html(data.recordsTotal);
			});
	$.get(moneyNoUrl, function(data) {
				$('#moneyno').html(data.recordsTotal);
			});
	$.get(projectEvectionUrl, function(data) {
				$('#survey').html(data.recordsTotal);
			});
	$.get(projectDraftUrl, function(data) {
				$('#draft').html(data.recordsTotal);
			});
	$.get(projectFinalUrl, function(data) {
				$('#finaldraft').html(data.recordsTotal);
			});
	$.get(projectEndUrl, function(data) {
				$('#finish').html(data.recordsTotal);
			});
	$.get("../../rs/proj/contract/totalM", function(data) {
				$('#totalM').html(data.data);
			});
	$.get("../../rs/proj/info/list", function(data) {
				$('#totalN').html(data.recordsTotal);
			});
	$.get(personEvectionUrl, function(data) {
				$('#evections').html(data.recordsTotal);
			});
	$.get(personLeaveUrl, function(data) {
				$('#leaves').html(data.recordsTotal);
			});

}
