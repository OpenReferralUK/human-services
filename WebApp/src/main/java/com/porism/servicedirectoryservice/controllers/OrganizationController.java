/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.services.IOrganizationService;
import com.porism.servicedirectoryservice.utilities.DTOUtility;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.OrganizationView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.porism.servicedirectoryservice.services.ILinkTaxonomyService;

/**
 *
 * @author Dominic Skinner
 */
@Api(tags = "Organizations")
@RestController
@RequestMapping("/organizations")
public class OrganizationController {
    @Autowired
    IOrganizationService organizationService;
    @Autowired
    ILinkTaxonomyService linkTaxonomyService;       
        
    @ApiOperation(value = "Get all organizations", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public Organization[] getOrganizations(@RequestParam(required = false) String taxonomy, @RequestParam(required = false) String scheme) {
        List<Organization> organizations;
        if (taxonomy != null && !"".equals(taxonomy))
        {
            List<LinkTaxonomy> linkTaxonomies = linkTaxonomyService.findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary("organization", taxonomy, scheme);
            organizations = organizationService.findByIdIn(DTOUtility.getIds(linkTaxonomies));
        }
        else
        {
            organizations = organizationService.findAll();       
        }         
        return organizations.toArray(new Organization[organizations.size()]);
    }   
    
    @ApiOperation(value = "Get a single organization")
    @JsonView(OrganizationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Organization getOrganization(@PathVariable("id") String id) {
        return organizationService.findById(id);
    }      
}
