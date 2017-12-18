package com.jpaAndActivity.common.mail;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

public class MailFacade {
    private static Logger logger = LoggerFactory.getLogger(MailFacade.class);
    private MailStore mailStore = new MailStore();
    private MailConsumer mailConsumer = new MailConsumer();
    private MailHelper mailHelper;
    @Value("${sendMail}")
	private String sendMail;

    @PostConstruct
    public void init() {
        mailStore.start();
        mailConsumer.setMailStore(mailStore);
        mailConsumer.setMailHelper(mailHelper);
        mailConsumer.start();
    }

    @PreDestroy
    public void close() {
        mailConsumer.stop();
        mailStore.stop();
    }
    /**
     * 发送邮件
     * @param to 收件人
     * @param cc 抄送人
     * @param subject 邮件标题
     * @param content 邮件内容
     */
    public void sendMail(String to, String cc, String subject, String content) {
        this.sendMail(null, to, cc , subject, content);
    }
    /**
     * 发送邮件
     * @param to 收件人
     * @param cc 抄送人
     * @param subject 邮件标题
     * @param content 邮件内容
     */
    public void sendHTMLMail(String to , String cc, String subject, String content) {
    	if(to==null){
    		logger.info("项目负责人邮箱不存在");
    		return ;
    	}
    	if(to.isEmpty()){
    		logger.info("项目负责人邮箱不存在");
    		return ;
    	}
    	Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm");
		String nowTime = sdf.format(date);
    	String html = "<html><body>"+content
				+ "<br/><br/><br/>"
				+"<div style='line-height:20px;border-top:1px solid #e6e6e6;padding:10px 0;text-align:right;'>项目管理系统项目组</div>"
				+ "		<div style='text-align:right;'>"+nowTime+"</div>"
				+ "</body></html>";
    	String titile = "项目管理系统-"+subject;
    	this.sendMail(null, to, cc, titile, html);
    }
    /**
     * 发送邮件
     * @param from 发件人 默认为 null 不用设置
     * @param to 收件人
     * @param cc 抄送人
     * @param subject 邮件标题
     * @param content 邮件内容
     */
    public void sendMail(String from, String to, String cc, String subject, String content) {
    	if(StringUtils.equals("true", sendMail)){
    		MailDTO mailDto = new MailDTO();
            mailDto.setFrom(from);
            mailDto.setTo(to);
            mailDto.setCc(cc);
            mailDto.setSubject(subject);
            mailDto.setContent(content);

            mailStore.sendMail(mailDto);
    	}
    }

    public void sendMail(MailDTO mailDto) {
        mailStore.sendMail(mailDto);
    }

    public void setMailStore(MailStore mailStore) {
        this.mailStore = mailStore;
    }

    public void setMailConsumer(MailConsumer mailConsumer) {
        this.mailConsumer = mailConsumer;
    }

    public void setMailHelper(MailHelper mailHelper) {
        this.mailHelper = mailHelper;
    }
}
