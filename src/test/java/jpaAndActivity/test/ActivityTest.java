package jpaAndActivity.test;
import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.cmd.DeleteProcessInstanceCmd;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring.xml", "classpath:spring-mvc.xml" })
public class ActivityTest {
@Autowired
private	ProcessEngine processEngine;
//提交申请并完成申请
@Test
public void StartProcess() {
	//提交申请
	String initiator="lichuang";
	Map<String, Object> map=new HashMap<>();
	map.put("initiator", initiator);
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


}
