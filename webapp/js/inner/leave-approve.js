var table = null;
$(function() {
			// 显示登录用户
			// initCurrentUser();

			$("#subBtn").click(doApprove);
			$("#returnBtn").click(doReject);
			var id = sessionStorage.getItem("id"); // 任务ID
			// alert(id);
			// 获取申请信息和审批信息
			$.get('../../rs/proj/leave/viewByTask', {
						id : id
					}, function(result) {
						var leaveInfo = result.data.leaveInfo;
						console.log(result);
						var startDate = new Date(leaveInfo.startDate);
						leaveInfo.startDate = startDate.getFullYear() + "-"
								+ (startDate.getMonth() + 1) + "-"
								+ startDate.getDate();
						var endDate = new Date(leaveInfo.endDate);
						leaveInfo.endDate = endDate.getFullYear() + "-"
								+ (endDate.getMonth() + 1) + "-"
								+ endDate.getDate();

						for (var key in leaveInfo) {
							$('#' + key).html(leaveInfo[key]);
						}

						var html = new Array();
						console.log(result.data.approvalInfoDtos);
						$(result.data.approvalInfoDtos).each(
								function(index, obj) {
									html.push("<tr>");
									html.push("<td>");
									html.push(obj.assignee);
									html.push("</td>");
									html.push("<td>");
									html.push(obj.name);
									html.push("</td>");
									html.push("<td>");
									if (obj.status == "completed") {
										html.push("完成");
									}
									if (obj.status == null) {
										html.push("审核中");
									}
									if (obj.status == "reject") {
										html.push("领导驳回申请");
									}
									if (obj.status == "withdraw") {
										html.push("申请人撤销申请");
									}
									html.push("</td>");
									html.push("<td>");
									html.push(obj.approvalOpinion);
									html.push("</td>");
									html.push("<td>");
									var approvalTime = obj.approvalTime;
									if (null != approvalTime) {
										approvalTime = new Date(approvalTime);
										var month = approvalTime.getMonth() + 1;
										var minutes = approvalTime.getMinutes();
										if (minutes < 10 && minutes != '0') {
											minutes = "0" + minutes;
										}
										var approvalTime = approvalTime
												.getFullYear()
												+ "-"
												+ month
												+ "-"
												+ approvalTime.getDate()
												+ " "
												+ approvalTime.getHours()
												+ ":"
												+ minutes
												+ ":"
												+ approvalTime.getSeconds();
										html.push(approvalTime);
									} else {
										html.push("")
									}
									html.push("</td>");
									html.push("</tr>");
									console.log(html.join(""));
								});
						$("#tbody").html(html.join(""));
					});

			$('#approveBtn').click(doApprove);
			$('#rejectBtn').click(doReject);
		})

function doApprove() {
	$.post('../../rs/proj/leave/approve', {
				id : sessionStorage.getItem("id"),
				comment : $('#textarea_reason').val()
			}, function(result) {
				backlogTask();
				$("#content").load("../proj/backlog-list.html");
			});
	
}

function doReject() {
	$.post('../../rs/proj/leave/reject', {
				id : sessionStorage.getItem("id"),
				comment : $('#textarea_reason').val()
			}, function(result) {
				backlogTask();
				$("#content").load("../proj/backlog-list.html");
			});
	
}
