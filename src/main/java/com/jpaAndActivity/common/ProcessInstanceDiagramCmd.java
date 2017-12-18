package com.jpaAndActivity.common;

import java.io.*;

import java.util.*;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.bpmn.diagram.*;
import org.activiti.engine.impl.cmd.*;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ExecutionEntityManager;
import org.activiti.engine.impl.persistence.entity.HistoricActivityInstanceEntity;
import org.activiti.engine.impl.persistence.entity.HistoricTaskInstanceEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.image.impl.DefaultProcessDiagramGenerator;
import org.activiti.engine.ProcessEngineConfiguration;


public class ProcessInstanceDiagramCmd implements Command<InputStream> {
    protected String processInstanceId;

    public ProcessInstanceDiagramCmd(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public InputStream execute(CommandContext commandContext) {
        ExecutionEntityManager executionEntityManager = commandContext
            .getExecutionEntityManager();
        ExecutionEntity executionEntity = executionEntityManager
            .findExecutionById(processInstanceId);
        List<String> activiityIds = executionEntity.findActiveActivityIds();
        String processDefinitionId = executionEntity.getProcessDefinitionId();

        GetBpmnModelCmd getBpmnModelCmd = new GetBpmnModelCmd(
                processDefinitionId);
        BpmnModel bpmnModel = getBpmnModelCmd.execute(commandContext);

        ProcessEngineConfiguration processEngineConfiguration = Context
                .getProcessEngineConfiguration();
		/*
		InputStream generateDiagram(
			BpmnModel bpmnModel,
			String imageType,
			List<String> highLightedActivities,
			List<String> highLightedFlows, 
			String activityFontName,
			String labelFontName,
			String annotationFontName,
			ClassLoader customClassLoader,
			double scaleFactor);
		*/
        InputStream is = new DefaultProcessDiagramGenerator().generateDiagram(
                bpmnModel, "png",activiityIds, Collections.<String>emptyList(), "宋体", "宋体", "宋体", null, 1D);

        return is;
    }
}
