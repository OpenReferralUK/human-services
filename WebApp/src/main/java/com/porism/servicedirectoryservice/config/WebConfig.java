/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 * @author Dominic Skinner
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/", "/swagger-ui.html");
    }
    
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer){
        configurer.setUseTrailingSlashMatch(true);
        configurer.setUseRegisteredSuffixPatternMatch(true);
    }
    
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(false);
        configurer.favorParameter(true);
        configurer.ignoreAcceptHeader(true);
        configurer.useRegisteredExtensionsOnly(true);
        configurer.defaultContentType(MediaType.APPLICATION_JSON);
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("csv", MediaType.TEXT_PLAIN);
    }
}
