package com.jpaAndActivity.common;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public class SpringSecurityUtils {
    private static Logger logger = LoggerFactory
            .getLogger(SpringSecurityUtils.class);

    protected SpringSecurityUtils() {
    }

    @SuppressWarnings("unchecked")
    public static <T extends UserDetails> T getCurrentUser() {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserDetails)) {
            return null;
        }

        return (T) principal;
    }

    /**
     * 取得当前用户的登录名, 如果当前用户未登录则返回空字符串.
     */
    public static String getCurrentUsername() {
        Authentication authentication = getAuthentication();

        if ((authentication == null) || (authentication.getPrincipal() == null)) {
            return "";
        }

        return authentication.getName();
    }

    /**
     * 取得当前用户登录IP, 如果当前用户未登录则返回空字符串.
     */
    public static String getCurrentUserIp() {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return "";
        }

        Object details = authentication.getDetails();

        if (!(details instanceof WebAuthenticationDetails)) {
            return "";
        }

        WebAuthenticationDetails webDetails = (WebAuthenticationDetails) details;

        return webDetails.getRemoteAddress();
    }

    /**
     * 将UserDetails保存到Security Context.
     * 
     * @param userDetails
     *            已初始化好的用户信息.
     * @param request
     *            用于获取用户IP地址信息,可为Null.
     */
    public static void saveUserDetailsToContext(UserDetails userDetails,
            HttpServletRequest request) {
        PreAuthenticatedAuthenticationToken authentication = new PreAuthenticatedAuthenticationToken(
                userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        if (request != null) {
            authentication.setDetails(new WebAuthenticationDetails(request));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public static void saveUserDetailsToContext(UserDetails userDetails,
            HttpServletRequest request, SecurityContext securityContext) {
        PreAuthenticatedAuthenticationToken authentication = new PreAuthenticatedAuthenticationToken(
                userDetails, userDetails.getPassword(),
                userDetails.getAuthorities());

        if (request != null) {
            authentication.setDetails(new WebAuthenticationDetails(request));
        }

        securityContext.setAuthentication(authentication);
    }

    /**
     * 取得Authentication, 如当前SecurityContext为空时返回null.
     */
    public static Authentication getAuthentication() {
        SecurityContext context = SecurityContextHolder.getContext();

        return context.getAuthentication();
    }

    public static List<String> getAuthorities() {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return Collections.EMPTY_LIST;
        }

        Collection<? extends GrantedAuthority> grantedAuthorityList = authentication
                .getAuthorities();

        List<String> authorities = new ArrayList<String>();

        for (GrantedAuthority grantedAuthority : grantedAuthorityList) {
            authorities.add(grantedAuthority.getAuthority());
        }

        return authorities;
    }

    // ~ ======================================================================
    /**
     * 判断用户是否拥有角色, 如果用户拥有参数中的任意一个角色则返回true.
     */
    public static boolean hasRole(String... roles) {
        if (roles == null) {
            logger.warn("roles is null");

            return false;
        }

        Collection<String> attributes = getAuthorities();

        for (String role : roles) {
            if (attributes.contains(role)) {
                logger.debug("has : {}", role);

                return true;
            }
        }

        return false;
    }

    public static boolean hasAllRoles(String... roles) {
        if (roles == null) {
            logger.warn("roles is null");

            return false;
        }

        Collection<String> attributes = getAuthorities();

        for (String role : roles) {
            if (!attributes.contains(role)) {
                logger.debug("lack : {}", role);

                return false;
            }
        }

        return true;
    }

    public static boolean lackRole(String... roles) {
        if (roles == null) {
            logger.warn("roles is null");

            return true;
        }

        Collection<String> attributes = getAuthorities();

        for (String role : roles) {
            if (!attributes.contains(role)) {
                logger.debug("lack : {}", role);

                return true;
            }
        }

        return false;
    }

    public static boolean lackAllRoles(String... roles) {
        if (roles == null) {
            logger.warn("roles is null");

            return true;
        }

        Collection<String> attributes = getAuthorities();

        for (String role : roles) {
            if (attributes.contains(role)) {
                logger.debug("has : {}", role);

                return false;
            }
        }

        return true;
    }

}
