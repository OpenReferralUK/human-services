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
    @Value("${api.url}")
    private String apiUrl;
    
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
      "An API to read open data compliant with Open Referral as extended for English local government and health data. Loaded with " + apiData + "\n\nWeb methods support JSON format outputs by default. Hence "+apiUrl+"services returns the same as "+apiUrl+"services.json\n\nImplementations supporting CSV append \".csv\" to the web method, eg "+apiUrl+"services.csv\n\n<a href=\"https://openreferraluk.org/Guidance/\" target=\"_blank\">Guidance on the data structure and each field</a>\n<a href=\"https://openreferraluk.org/API-Guidance/\" target=\"_blank\">Guidance on using the API</a>\n<a href=\"https://openreferraluk.org/ContactUs/\" target=\"_blank\">Contacts and to raise issues</a>\n<a href=\"http://www.nationalarchives.gov.uk/doc/open-government-licence\" target=\"_blank\">License of API</a>", 
      null, 
      null,
      null, null, null, Collections.emptyList());
}
}
