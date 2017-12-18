$(function() {
			var id = sessionStorage.getItem("leaveId");
			$('#graphImg').attr('src',
					'../../activiti/graph.jsp?businessKey=' + id);
			$('#leaveBtn').click(returnReimBtn);
		})

function returnReimBtn() {
	$("#content").load("../proj/leave-list.html");
}