package jpaAndActivity.test;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricTaskInstanceQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import com.jpaAndActivity.dto.leaveProject;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring.xml", "classpath:spring-mvc.xml" })
public class ActivityTest {
@Autowired
private	ProcessEngine processEngine;
//提交申请并完成申请
@Test
public void StartProcess() {
	//提交申请
	String initiator="lichuang";//申请人
	   List<leaveProject> leaveProjects=new ArrayList<>();//审批人
	   leaveProject leave=new leaveProject();
	   leave.setUserName("zhangsan");
	   leaveProjects.add(leave);
	   leaveProject leave1=new leaveProject();
	   leave1.setUserName("lisi");
	   leaveProjects.add(leave1);
	Map<String, Object> map=new HashMap<>();
	map.put("initiator", initiator);
	map.put("leaveProjects", leaveProjects);
	RuntimeService runtimeService = processEngine.getRuntimeService();
	/**
	 * leave :流程图中整个流程的id
	 * 1001:实际项目中每条请假记录的id  businesskey
	 * map:提交申请的人的姓名  在流程图中如此定义 ${initiator}
	 */
	ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("leave","1001",
			 map);
	String processInstanceId = processInstance.getProcessInstanceId();//流程实例id
	//完成提交申请
	TaskService taskService = processEngine.getTaskService();
	Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();
 	taskService.complete(task.getId());
 	//判断流程是否结束
   ProcessInstance singleResult = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
   System.out.println("判断流程是否结束"+singleResult);
   }
//撤销申请，此时还没有任何人审批
@Test
public void deleteProcess() {
	String businessKey="1001";
	//根据businesskey 删除操作   在历史表中设置该条记录为withdrow
	ProcessInstance processInstance = processEngine.getRuntimeService()
			.createProcessInstanceQuery().processInstanceBusinessKey(businessKey).singleResult();
		processEngine.getRuntimeService().deleteProcessInstance(processInstance.getId(), "withdraw");
	System.out.println(processInstance.getBusinessKey()+processInstance.getProcessInstanceId());
   }
//根据任务id获取businesskey
@Test
public void getBusinessKey() {
	String taskId="10008";
	HistoryService historyService = processEngine.getHistoryService();
	String processInstanceId = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult()
			.getProcessInstanceId();
	String businessKey = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId)
			.singleResult().getBusinessKey();
	System.out.println(businessKey);
}
//审批   并添加审批意见,这里是审批通过
@Test
public void complete() {
String taskId="12528";
String comment="审批意见"; //在表  ACT_HI_COMMENT
TaskService taskService = processEngine.getTaskService();
Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
String processInstanceId = task.getProcessInstanceId();
taskService.addComment(taskId, processInstanceId, comment);//添加审批意见
taskService.complete(taskId);
  }
//审批，驳回申请
//和撤销申请一样，需要重新提交申请
@Test
public  void  reject() {
	String  taskId="12521";
	String comment="审批不通过"; //在表  ACT_HI_COMMENT
	TaskService taskService = processEngine.getTaskService();
	Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
	String processInstanceId = task.getProcessInstanceId();
	taskService.addComment(taskId, processInstanceId, comment);//添加审批意见
	processEngine.getRuntimeService().deleteProcessInstance(processInstanceId, "reject");
	System.out.println("申请被驳回");
}
/**
 * 待办审批
 */
@Test
public  void  needComplete() {
	//List<Task> list = processEngine.getTaskService().createTaskQuery().taskAssignee("lichuang").list();
	TaskQuery taskQuery = processEngine.getTaskService().createTaskQuery().orderByTaskCreateTime().desc();
	List<Task> listPage = taskQuery.listPage(0, 10);//分页
	taskQuery.count();//总数
	for (Task task : listPage) {
		System.out.println(task.getAssignee()+"============="+task.getProcessDefinitionId());
	}
	System.out.println("待办的总数"+taskQuery.count());
}
/**
 * 已经办理的任务
 */
@Test
public void  exitComplete() {
	HistoricTaskInstanceQuery desc = processEngine.getHistoryService().createHistoricTaskInstanceQuery()
			.finished().taskDeleteReason("completed").orderByTaskCreateTime().desc();
	List<HistoricTaskInstance> listPage = desc.listPage(0, 10);//分页
	for (HistoricTaskInstance historicTaskInstance : listPage) {
		System.out.println(historicTaskInstance.getAssignee()+"===="+historicTaskInstance.getProcessInstanceId());
	}
	System.out.println("已经办理任务的总数"+desc.count());
}
}
