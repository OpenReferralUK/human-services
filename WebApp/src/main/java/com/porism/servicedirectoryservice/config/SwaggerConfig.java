/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.config;

import com.google.common.base.Predicates;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Tag;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 *
 * @author Dominic Skinner
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Value("${api.data}")
    private String apiData;
    
    @Bean
    public Docket api() { 
        return new Docket(DocumentationType.SWAGGER_2)  
          .select()                                  
          .apis(RequestHandlerSelectors.basePackage("com.porism.servicedirectoryservice.controllers"))  
          .paths(PathSelectors.any())
          .paths(Predicates.not(PathSelectors.regex("/hservices.*")))                          
          .paths(Predicates.not(PathSelectors.regex(".*\\.json"))) 
          .paths(Predicates.not(PathSelectors.regex(".*\\.csv"))) 
          .build()
          .apiInfo(apiInfo())
          .tags(
                  new Tag("Locations", ""),
                  new Tag("Services", ""),
                  new Tag("Organizations", ""),
                  new Tag("Reviews", ""),
                  new Tag("Taxonomies", ""),
                  new Tag("Vocabularies", "")
           );                                           
    }
    
    private ApiInfo apiInfo() {
    return new ApiInfo(
      "Human services API", 
      "An API to read open data compliant with Open Referral as extended for English local government and health data. Loaded with " + apiData, 
      "https://github.com/esd-org-uk/human-services/blob/master/README.md#api-terms", 
      "Terms of service", 
      new Contact("ESD Support", "https://www.esd.org.uk", "support@esd.org.uk"), 
      "License of API", "http://www.nationalarchives.gov.uk/doc/open-government-licence   ", Collections.emptyList());
}
}
