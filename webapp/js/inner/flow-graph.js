var table = null;
$(function(){
	var id = sessionStorage.getItem("id");
	$('#graphImg').attr('src', '../../activiti/graph.jsp?businessKey=' + id);
	$('#btn').click(returnBtn);
})

function returnBtn (){
	$("#content").load("../proj/evection-list.html");
}