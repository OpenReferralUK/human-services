/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.EsdPostcode;
import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.models.ServiceArea;
import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import com.porism.servicedirectoryservice.services.ICostOptionService;
import com.porism.servicedirectoryservice.services.IEligibilityService;
import com.porism.servicedirectoryservice.services.IEsdPostcodeService;
import com.porism.servicedirectoryservice.services.ILinkTaxonomyService;
import com.porism.servicedirectoryservice.services.IOrganizationService;
import com.porism.servicedirectoryservice.services.IServiceAreaService;
import com.porism.servicedirectoryservice.services.IServiceAtLocationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.services.IServiceService;
import com.porism.servicedirectoryservice.utilities.DTOUtility;
import com.porism.servicedirectoryservice.views.ServiceView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.porism.servicedirectoryservice.services.IServiceTaxonomyService;
import com.porism.servicedirectoryservice.views.ServiceBasicView;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 *
 * @author Dominic Skinner
 */
@Api(tags = "Services")
@RestController
@RequestMapping("/services")
public class ServiceController {
    @Autowired
    IServiceService serviceService;
    @Autowired
    IServiceTaxonomyService serviceTaxonomyService; 
    @Autowired
    IEsdPostcodeService esdPostcodeService;  
    @Autowired
    IServiceAtLocationService serviceAtLocationService;
    @Autowired
    ILinkTaxonomyService linkTaxonomyService;    
    @Autowired
    IEligibilityService eligibilityService;
    @Autowired
    ICostOptionService costOptionService;
    @Autowired
    IServiceAreaService serviceAreaService;    
    @Autowired
    IOrganizationService organizationService;    
    
    private static final String AREA = "area";
    private static final String ORGANIZATION = "organization";
    private static final String ELIGIBILITY = "eligibility";
    private static final String COST_OPTION = "cost_option";    
    
    @ApiOperation(value = "Get all services", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @ApiParam(name = "taxonomy_type", allowableValues = "organization, eligibility, cost_option, area, service", required = false)
    @JsonView(ServiceBasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public Page<Service> getServices(@RequestParam(required = false) String taxonomy_id, @RequestParam(required = false) String taxonomy_type, @RequestParam(required = false) String vocabulary, @RequestParam(required = false) String postcode, @RequestParam(required = false) Double proximity, @RequestParam(required = false) String coverage, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "50") Integer per_page) {
        Page<Service> services;
               
        if ((taxonomy_id != null && !"".equals(taxonomy_id)) || (postcode != null && !"".equals(postcode)) || (coverage != null && !"".equals(coverage)))
        {
            List<String> ids = null;
            ids = getCoverageIds(coverage, ids);            
            ids = getPostcodeIds(postcode, proximity, ids);
            ids = getTaxonomyIds(taxonomy_id, taxonomy_type, vocabulary, ids);
            services = serviceService.findByIdIn(ids, PageRequest.of(page - 1, per_page));
        }
        else
        {
            services = serviceService.findAll(PageRequest.of(page - 1, per_page));        
        }
        
        return services;
    }   

    private List<String> getTaxonomyIds(String taxonomy_id, String taxonomy_type, String vocabulary, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }        
        if (taxonomy_id != null && !"".equals(taxonomy_id))
        {
            if (taxonomy_type != null)
            {
                taxonomy_type = taxonomy_type.toLowerCase();
            }
            
            List<String> tmp;
            
            if (ELIGIBILITY.equals(taxonomy_type) || COST_OPTION.equals(taxonomy_type) || AREA.equals(taxonomy_type)
                    || ORGANIZATION.equals(taxonomy_type))
            {
                List<LinkTaxonomy> linkTaxonomies = linkTaxonomyService.findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_id, taxonomy_type, vocabulary);
                tmp = linkTaxonomyToServiceIds(taxonomy_type, linkTaxonomies);
            }
            else if (taxonomy_type == null || "".equals(taxonomy_type))
            {
                String[] linkTypes = {ELIGIBILITY, COST_OPTION, AREA, ORGANIZATION};
                tmp = DTOUtility.getIds(serviceTaxonomyService.findByTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_id, vocabulary));                
                List<LinkTaxonomy> linkTaxonomies = linkTaxonomyService.findByTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_id, vocabulary);
                                
                for(String linkType : linkTypes)
                {
                    List<LinkTaxonomy> ofType = new ArrayList<LinkTaxonomy>();
                    for(LinkTaxonomy linkTaxonomy : linkTaxonomies)
                    {
                        if (linkType.equals(linkTaxonomy.getLinkType()))
                        {
                            ofType.add(linkTaxonomy);
                        }
                    }
                    tmp.addAll(linkTaxonomyToServiceIds(taxonomy_type, ofType));
                }                
            }            
            else
            {
                //this must be service only
                tmp = DTOUtility.getIds(serviceTaxonomyService.findByTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_id, vocabulary));
            }
            
            ids = intersect(ids, tmp);
        }
        return ids;
    }   

    private List<String> linkTaxonomyToServiceIds(String taxonomy_type, List<LinkTaxonomy> linkTaxonomies) {
        List<String> tmp = new ArrayList<String>();
        
        if (ELIGIBILITY.equals(taxonomy_type))
        {
            tmp = DTOUtility.getIds(eligibilityService.findByIdIn(DTOUtility.getIds(linkTaxonomies)));
        }
        else if (COST_OPTION.equals(taxonomy_type))
        {
            tmp = DTOUtility.getIds(costOptionService.findByIdIn(DTOUtility.getIds(linkTaxonomies)));
        }
        else if (AREA.equals(taxonomy_type))
        {
            tmp = DTOUtility.getIds(serviceAreaService.findByIdIn(DTOUtility.getIds(linkTaxonomies)));
        }
        else
        {
            tmp = new ArrayList<String>();
            List<Organization> organizations = organizationService.findByIdIn(DTOUtility.getIds(linkTaxonomies));
            if (organizations != null)
            {
                for(Organization organization : organizations)
                {
                    if (organization.getServiceCollection() == null)
                    {
                        continue;
                    }
                    for(Service service : organization.getServiceCollection())
                    {
                        tmp.add(service.getId());
                    }
                }
            }
        }
        
        return tmp;
    }

    private List<String> intersect(List<String> ids, List<String> tmp) {
        if (ids == null)
        {
            ids = tmp;
        }
        else if (tmp != null)
        {
            ids.retainAll(tmp);
        }
        return ids;
    }

    private List<String> getPostcodeIds(String postcode, Double distance, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }        
        if (postcode != null && !"".equals(postcode) && distance != null)
        {
            List<String> tmp = new ArrayList<String>();            
            postcode = postcode.replaceAll(" ", "");
            
            EsdPostcode esdPostcode = esdPostcodeService.findByCode(postcode);
            if (esdPostcode != null)
            {
                List<ServiceAtLocation> locations = null;
                if (ids != null)
                {
                    locations = serviceAtLocationService.findByLatitudeLongitudeAndService(esdPostcode.getLatitude(), esdPostcode.getLongitude(), distance, ids);
                }
                else
                {
                    locations = serviceAtLocationService.findByLatitudeLongitude(esdPostcode.getLatitude(), esdPostcode.getLongitude(), distance);
                }
                for(ServiceAtLocation location : locations)
                {
                    tmp.add(location.getServiceId().getId());
                }                
            }
            
            ids = intersect(ids, tmp);
        } 
        return ids;
    }

    private List<String> getCoverageIds(String coverage, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }
        if (coverage != null && !"".equals(coverage))
        {
            List<String> tmp = new ArrayList<String>();            
            coverage = coverage.replaceAll(" ", "");
            
            EsdPostcode esdPostcode = esdPostcodeService.findByCode(coverage);
            if (esdPostcode != null)
            {
                List<ServiceArea> areas = serviceAreaService.findByLatitudeLongitude(esdPostcode.getLatitude(), esdPostcode.getLongitude());
                for(ServiceArea area : areas)
                {
                    tmp.add(area.getServiceId().getId());
                }
            }
            
            ids = intersect(ids, tmp);
        }
        return ids;
    }
    
    @ApiOperation(value = "Get a single service")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Service getService(@PathVariable("id") String id) {
        return serviceService.findById(id);
    }      
}
