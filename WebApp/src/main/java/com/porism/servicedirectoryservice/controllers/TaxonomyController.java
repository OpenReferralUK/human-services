/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Taxonomy;
import com.porism.servicedirectoryservice.services.ITaxonomyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author Dominic Skinner
 */

@Api(tags = "Taxonomies")
@RestController
@RequestMapping("/taxonomies")
public class TaxonomyController {
    @Autowired
    ITaxonomyService taxonomyService;
        
    @ApiOperation(value = "Get all taxonomies")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public Taxonomy[] getTaxonomies(@RequestParam(required = false) String vocabulary) {
        List<Taxonomy> taxonomies;
        if (vocabulary != null && !"".equals(vocabulary))
        {
            taxonomies = taxonomyService.findByVocabulary(vocabulary);            
        }
        else
        {
            taxonomies = taxonomyService.findAll();  
        }        
        return taxonomies.toArray(new Taxonomy[taxonomies.size()]);
    }   
    
    @ApiOperation(value = "Get a single taxonomy")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Taxonomy getTaxonomy(@PathVariable("id") String id) {
        return taxonomyService.findById(id);
    }      
}
