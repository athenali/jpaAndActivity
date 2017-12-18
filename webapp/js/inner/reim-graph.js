$(function(){
	var id = sessionStorage.getItem("reimId");
	$('#graphImg').attr('src', '../../activiti/graph.jsp?businessKey=' + id);
	$('#reimbtn').click(returnReimBtn);
})

function returnReimBtn (){
	 $("#content").load("../proj/reimburse-list.html");
}