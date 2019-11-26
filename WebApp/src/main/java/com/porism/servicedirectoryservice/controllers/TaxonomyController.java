/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Taxonomy;
import com.porism.servicedirectoryservice.services.ITaxonomyService;
import com.porism.servicedirectoryservice.utilities.ResponseUtility;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    @RequestMapping(value = {"", ".json", ".csv", "/.json", "/.csv"}, method = RequestMethod.GET, produces = "application/json")
    public Page<Taxonomy> getTaxonomies(HttpServletResponse response, HttpServletRequest request, @RequestParam(required = false) String text, @RequestParam(required = false) String parent_id, @RequestParam(required = false) String vocabulary, @RequestParam(required = false) List<String> needs, @RequestParam(required = false) List<String> circumstances, @RequestParam(required = false) boolean root_only, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "50") Integer per_page) throws IllegalArgumentException, IOException, Exception {
        if ((vocabulary != null && !"".equals(vocabulary)) || 
                (parent_id != null && !"".equals(parent_id)) || 
                (text != null && !"".equals(text)) || 
                (circumstances != null && !circumstances.isEmpty()) || 
                (needs != null && !needs.isEmpty()) ||
                root_only)
        {
            List<String> taxonomyIds = taxonomyService.findIdsByCircumstance(circumstances);
            taxonomyIds.addAll(taxonomyService.findIdsByNeed(needs));
            if (taxonomyIds.isEmpty() && circumstances != null && !circumstances.isEmpty() && needs != null && !needs.isEmpty())                
            {
                taxonomyIds = null;
            }
            return ResponseUtility.HandleResponse(request, response, taxonomyService.findByVocabularyAndParentIdAndSearch(taxonomyIds, text, vocabulary, parent_id, root_only, PageRequest.of(page - 1, per_page)), BasicView.class);
        }
        return ResponseUtility.HandleResponse(request, response, taxonomyService.findAll(PageRequest.of(page - 1, per_page)), BasicView.class);
    }   
    
    @ApiOperation(value = "Get a single taxonomy")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Taxonomy getTaxonomy(HttpServletResponse response, HttpServletRequest request, @PathVariable("id") String id) throws IllegalArgumentException, IOException, Exception {
        return ResponseUtility.HandleResponse(request, response, taxonomyService.findById(id), BasicView.class);
    }
    
    @ApiOperation(value = "Create a taxonomy")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public Taxonomy postTaxonomy(@RequestBody Taxonomy taxonomy) throws Exception {
        String taxonomyId = taxonomy.getId();
        if (taxonomyId == null || taxonomyId.length() == 0){
            taxonomy.setId(java.util.UUID.randomUUID().toString());
        }
        if (taxonomyService.findById(taxonomy.getId()) != null)
        {
            throw new Exception("Cannot create taxonomy as a taxonomy with this ID already exists");
        }
        
        return taxonomyService.save(taxonomy);
    }   
    
    @ApiOperation(value = "Update a taxonomy")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Taxonomy putTaxonomy(@PathVariable("id") String id, @RequestBody Taxonomy taxonomy) throws Exception {
        if (taxonomyService.findById(id) == null)
        {
            throw new Exception("Cannot update taxonomy as no taxonomy with this ID exists");
        }
        
        return taxonomyService.save(taxonomy);
    }
}
