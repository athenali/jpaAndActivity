var table = null;
$(function() {
			var id = sessionStorage.getItem("id"); // 任务ID
			// 获取申请信息和审批信息
			$('#returnBtn').click(returnBtn);
			$.get('../../rs/proj/contract/viewByTask1', {
						id : id
					}, function(result) {
						var contractDTO2 = result.data.contractDTO2;
						console.log(result);
						for (var key in contractDTO2) {
							$('#' + key).html(contractDTO2[key]);
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
										html.push("驳回申请");
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
		})

function returnBtn() {

	$("#content").load("../proj/backlog-list.html");
}
