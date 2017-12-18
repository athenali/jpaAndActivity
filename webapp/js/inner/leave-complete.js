var table = null;
$(function() {
			var id = sessionStorage.getItem("id");
			$.post('../../rs/proj/leave/grap', {
						id : id
					}, function(data) {
						$('#graphImg').attr(
								'src',
								'../../activiti/graph.jsp?processDefinitionId='
										+ data.data);
					});

			$('#btn').click(returnBtn);
		})

function returnBtn() {
	$("#content").load("../proj/leave-list.html");
}