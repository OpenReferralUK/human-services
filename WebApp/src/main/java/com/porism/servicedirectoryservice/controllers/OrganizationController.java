/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.porism.servicedirectoryservice.utilities.ResponseUtility;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.services.IEsdExternalIdService;
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
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestBody;

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
    @Autowired
    IEsdExternalIdService esdExternalIdService;
        
    @ApiOperation(value = "Get all organizations", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(BasicView.class)
    @RequestMapping(value = {"", ".json", ".csv", "/.json", "/.csv"}, method = RequestMethod.GET, produces = {"application/json", "text/csv"})
    public Organization[] getOrganizations(HttpServletResponse response, HttpServletRequest request, @RequestParam(required = false) String taxonomy, @RequestParam(required = false) String scheme) throws IOException, Exception {
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
        
        return ResponseUtility.HandleResponse(request, response, organizations.toArray(new Organization[organizations.size()]), BasicView.class);
    }   


    @ApiOperation(value = "Get a single organization")
    @JsonView(OrganizationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = {"application/json", "text/csv"})
    public Organization getOrganization(HttpServletResponse response, HttpServletRequest request, @PathVariable("id") String id) throws IllegalArgumentException, IOException, Exception {
        return ResponseUtility.HandleResponse(request, response, organizationService.findById(id), OrganizationView.class);
    }
    
    @ApiOperation(value = "Create an organization")
    @JsonView(OrganizationView.class)
    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public Organization postReview(@RequestBody Organization organization) throws Exception {
        organization.setId(esdExternalIdService.EnsureUUID(organization.getId(), "organization"));
        if (organizationService.findById(organization.getId()) != null)
        {
            throw new Exception("Cannot create organization as an organization with this ID already exists");
        }
        
        return organizationService.save(organization);
    } 
    
    @ApiOperation(value = "Update an organization")
    @JsonView(OrganizationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Organization putOrganization(@PathVariable("id") String id, @RequestBody Organization organization) throws Exception {
        if (organizationService.findById(id) == null)
        {
            throw new Exception("Cannot update organization as no organization with this ID exists");
        }
        
        return organizationService.save(organization);
    }
}
