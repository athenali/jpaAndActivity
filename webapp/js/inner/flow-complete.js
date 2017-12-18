var table = null;
$(function(){
	var id = sessionStorage.getItem("id");
	$.post('../../rs/proj/evection/grap', {
		id : id
	}, function(data) {
		$('#graphImg').attr('src', '../../activiti/graph.jsp?processDefinitionId='+ data.data);
	});
	
	$('#btn').click(returnBtn);
})

function returnBtn (){
	$("#content").load("../proj/evection-list.html");
}