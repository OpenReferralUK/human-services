/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.type.CollectionLikeType;
import com.porism.servicedirectoryservice.exceptions.MissingParameterException;
import com.porism.servicedirectoryservice.models.EsdPostcode;
import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.models.RegularSchedule;
import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.models.ServiceArea;
import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import com.porism.servicedirectoryservice.services.ICostOptionService;
import com.porism.servicedirectoryservice.services.IEligibilityService;
import com.porism.servicedirectoryservice.services.IEsdExternalIdService;
import com.porism.servicedirectoryservice.services.IEsdPostcodeService;
import com.porism.servicedirectoryservice.services.ILinkTaxonomyService;
import com.porism.servicedirectoryservice.services.IOrganizationService;
import com.porism.servicedirectoryservice.services.IRegularScheduleService;
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
import com.porism.servicedirectoryservice.services.ITaxonomyService;
import com.porism.servicedirectoryservice.utilities.ResponseUtility;
import com.porism.servicedirectoryservice.utilities.ServiceSerializer;
import com.porism.servicedirectoryservice.validation.Rating;
import com.porism.servicedirectoryservice.validation.RatingUtility;
import com.porism.servicedirectoryservice.validation.Ratings;
import com.porism.servicedirectoryservice.validation.ValidationResult;
import com.porism.servicedirectoryservice.validation.ValidationUtility;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.ServiceBasicView;
import io.swagger.annotations.ApiParam;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;

/**
 *
 * @author Dominic Skinner
 */
@Api(tags = "Services")
@RestController
@RequestMapping(value = {"/services", "/hservices"})
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
    @Autowired
    ITaxonomyService taxonomyService;
    @Autowired
    IRegularScheduleService regularScheduleService;
    @Autowired
    IEsdExternalIdService esdExternalIdService;
    
    private static final String AREA = "area";
    private static final String ORGANIZATION = "organization";
    private static final String ELIGIBILITY = "eligibility";
    private static final String COST_OPTION = "cost_option";    
    
    @ApiOperation(value = "Get all services", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")    
    @JsonView(ServiceBasicView.class)        
    @RequestMapping(value = {"", ".json", ".csv", "/.json", "/.csv"}, method = RequestMethod.GET, produces = "application/json")
    public Page<Service> getServices(HttpServletResponse response, HttpServletRequest request, @ApiParam(name = "taxonomy_type", allowableValues = "organization, eligibility, cost_option, area, service", required = false) @RequestParam(required = false) List<String> taxonomy_id, @RequestParam(required = false) List<String> taxonomy_type, @RequestParam(required = false) List<String> vocabulary, @RequestParam(required = false) List<String> need, @RequestParam(required = false) List<String> circumstance, @RequestParam(required = false) List<String> start_time, @RequestParam(required = false) List<String> end_time, @RequestParam(required = false) List<String> day, @RequestParam(required = false) String postcode, @RequestParam(required = false) Double proximity, @RequestParam(required = false) String coverage, @RequestParam(required = false) String text, @RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "50") Integer per_page, @RequestParam(required = false) Float minimum_age, @RequestParam(required = false) Float maximum_age, @ApiParam(name = "include", value = "Enter the name of a service field and it will be included in the result. e.g. service_at_locations", required = false) @RequestParam(required = false) List<String> include) throws MissingParameterException, IllegalArgumentException, IOException, Exception {
        Page<Service> services;
               
        if ((taxonomy_id != null && !taxonomy_id.isEmpty()) || 
                (postcode != null && !"".equals(postcode)) || 
                (coverage != null && !"".equals(coverage)) ||
                (need != null && !need.isEmpty()) ||
                (circumstance != null && !circumstance.isEmpty()) ||
                (start_time != null && !start_time.isEmpty()) ||
                (end_time != null && !end_time.isEmpty()) ||
                (day != null && !day.isEmpty()) || 
                (minimum_age != null) ||
                (maximum_age != null))
        {
            List<String> ids = null;
            
            ids = getAge(minimum_age, maximum_age, ids);
            ids = getCoverageIds(coverage, ids);            
            ids = getPostcodeIds(postcode, proximity, ids);
            ids = getTaxonomyIds(taxonomy_id, taxonomy_type, vocabulary, ids);
            ids = getNeedIds(need, ids);
            ids = getCircumstanceIds(circumstance, ids);
            ids = getAvailabilityIds(start_time, end_time, day, ids);
                       
            if (text == null || "".equals(text))
            {
                services = serviceService.findByIdIn(ids, PageRequest.of(page - 1, per_page));
            }
            else
            {
                services = serviceService.findByIdInAndTextSearch(ids, text, PageRequest.of(page - 1, per_page));
            }
        }
        else if (text != null && !"".equals(text))
        {
            services = serviceService.findByTextSearch(text, PageRequest.of(page - 1, per_page));
        }
        else
        {
            services = serviceService.findAll(PageRequest.of(page - 1, per_page));        
        }
                
        if (include != null)
        {
            HashSet<String> allowedFields = new HashSet<String>();
            
            for(String attr : include)
            {
                allowedFields.add(attr);
            }
        
            ObjectMapper mapper = new ObjectMapper();
            CollectionLikeType type = mapper.getTypeFactory().constructCollectionLikeType(Page.class, Service.class);
            ServiceSerializer serviceSerializer = new ServiceSerializer(type);
            serviceSerializer.setAllowedFields(allowedFields);
            serviceSerializer.setPagable(!ResponseUtility.isCSV(request));

            SimpleModule module = new SimpleModule();        
            module.addSerializer(serviceSerializer);
            mapper.registerModule(module);
            
            return ResponseUtility.HandleResponse(request, response, mapper.writeValueAsString(services));
        }
                
        return ResponseUtility.HandleResponse(request, response, services, ServiceBasicView.class);
    }   
    
    private List<String> getAvailabilityIds(List<String> startTime, List<String> endTime, List<String> day, List<String> ids) throws MissingParameterException {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        } 
        
        List<String> tmp = new ArrayList<String>();
        
        int size = 0;
        if (startTime != null)
        {
            size = startTime.size();
        }
        else if (endTime != null)
        {
            size = endTime.size();
        }
        else if (day != null)
        {
            size = day.size();
        }       
        else
        {
            return ids;
        }
        
        tmp.addAll(this.serviceService.findAllNonScheduledServices());
        
        for(int i = 0; i < size;i++)
        {
            String startT = "";
            String endT = "";
            String d = "";
            
            if (startTime != null && startTime.size() > i)
            {
                startT = startTime.get(i);
            }            
            if (endTime != null && endTime.size() > i)
            {
                endT = endTime.get(i);
            }
            if (day != null && day.size() > i)
            {
                d = day.get(i);
            }  
            
            List<RegularSchedule> regularSchedules = regularScheduleService.findByAvailablity(startT, endT, d);            
            for(RegularSchedule regularSchedule : regularSchedules){
                if (regularSchedule.getServiceId() != null)
                {
                    tmp.add(regularSchedule.getServiceId().getId());
                }
                else if (regularSchedule.getServiceAtLocationId() != null && regularSchedule.getServiceAtLocationId().getServiceId() != null)
                {
                    tmp.add(regularSchedule.getServiceAtLocationId().getServiceId().getId());                    
                }
            }
        }
        
        //this is done outside of the for loop to make it an OR.
        return intersect(ids, tmp);
    }

    private List<String> getTaxonomyIds(List<String> taxonomy_ids, List<String> taxonomy_types, List<String> vocabularies, List<String> ids) throws MissingParameterException {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        } 
        
        if (taxonomy_ids == null || taxonomy_ids.isEmpty())
        {
            return ids;
        }
        
        if (vocabularies == null || vocabularies.isEmpty() || taxonomy_ids.size() < vocabularies.size())
        {
            throw new MissingParameterException("vocabulary");
        }
        
        if (taxonomy_ids.size() > vocabularies.size())
        {
            throw new MissingParameterException("taxonomy_id");
        }       
        
        for(int i = 0; i < taxonomy_ids.size();i++)
        {
            String taxonomy_id = taxonomy_ids.get(i);
            String vocabulary = vocabularies.get(i);
            String taxonomy_type = "";
            if (taxonomy_types != null && taxonomy_types.size() > i)
            {
                taxonomy_type = taxonomy_types.get(i);
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
                    List<LinkTaxonomy> linkTaxonomies = linkTaxonomyService.findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_type, taxonomy_id, vocabulary);
                    tmp = linkTaxonomyToServiceIds(taxonomy_type, linkTaxonomies);
                    if (ELIGIBILITY.equals(taxonomy_type))
                    {
                        tmp.addAll(serviceService.findAllNonEligibleServices());
                    }
                }
                else if (taxonomy_type == null || "".equals(taxonomy_type) || "any".equals(taxonomy_type))
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
                        tmp.addAll(linkTaxonomyToServiceIds(linkType, ofType));
                    }                
                }            
                else
                {
                    //this must be service only
                    tmp = DTOUtility.getIds(serviceTaxonomyService.findByTaxonomyIdIdAndTaxonomyIdVocabulary(taxonomy_id, vocabulary));
                }

                ids = intersect(ids, tmp);
            }
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
                List<Service> services = null;
                if (ids != null)
                {
                    services = serviceService.findByLatitudeLongitudeAndService(esdPostcode.getLatitude(), esdPostcode.getLongitude(), distance, ids);
                }
                else
                {
                    services = serviceService.findByLatitudeLongitude(esdPostcode.getLatitude(), esdPostcode.getLongitude(), distance);
                }
                for(Service service : services)
                {
                    tmp.add(service.getId());
                }                
            }
            
            ids = intersect(ids, tmp);
        } 
        return ids;
    }
    
    private List<String> getNeedIds(List<String> needs, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }
        if (needs != null && !needs.isEmpty())
        {
            for(String need : needs)
            {
                List<String> tmp = new ArrayList<String>();            

                List<ServiceTaxonomy> serviceTaxonomies = serviceTaxonomyService.findByNeed(need);
                if (serviceTaxonomies != null)
                {
                    for(ServiceTaxonomy serviceTaxonomy : serviceTaxonomies)
                    {
                        tmp.add(serviceTaxonomy.getServiceId().getId());
                    }
                }

                ids = intersect(ids, tmp);
            }
        }
        return ids;
    }  
    
    private List<String> getCircumstanceIds(List<String> circumstances, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }
        if (circumstances != null && !circumstances.isEmpty())
        {
            for(String circumstance : circumstances)
            {
                List<String> tmp = new ArrayList<String>();            

                List<ServiceTaxonomy> serviceTaxonomies = serviceTaxonomyService.findByCircumstance(circumstance);
                if (serviceTaxonomies != null)
                {
                    for(ServiceTaxonomy serviceTaxonomy : serviceTaxonomies)
                    {
                        tmp.add(serviceTaxonomy.getServiceId().getId());
                    }
                }

                ids = intersect(ids, tmp);
            }
        }
        return ids;
    }     

    private List<String> getAge(Float minAge, Float maxAge, List<String> ids) {
        if (ids != null && ids.isEmpty())
        {
            return ids;
        }
        if (minAge != null || maxAge != null)
        {
            List<String> tmp = eligibilityService.findByAge(minAge, maxAge);            
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
    public Service getService(HttpServletResponse response, HttpServletRequest request, @PathVariable("id") String id) throws IllegalArgumentException, IOException, Exception {
        return ResponseUtility.HandleResponse(request, response, serviceService.findById(id), ServiceView.class);
    }    
    
    @ApiOperation(value = "Create a service")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public Service postService(@RequestBody Service service) throws Exception {
        ValidationResult[] validationResults = ValidationUtility.Validate(service, taxonomyService, "service", true);
        if (validationResults.length > 0){
            String message = "Failed validation for the following reasons:";
            for (ValidationResult result : validationResults){
                message = message + "\n" + result.message;
            }
            throw new Exception(message);
        }
        
        service.setId(esdExternalIdService.EnsureUUID(service.getId(), "service"));
        if (serviceService.findById(service.getId()) != null)
        {
            throw new Exception("Cannot create service as a service with this ID already exists");
        }
        
        return serviceService.save(service);
    }   
    
    @ApiOperation(value = "Update a service")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Service putService(@PathVariable("id") String id, @RequestBody Service service) throws Exception {
        if (serviceService.findById(id) == null)
        {
            throw new Exception("Cannot update service as no service with this ID exists");
        }
        
        return serviceService.save(service);
    }

    @ApiOperation(value = "Validate a single service")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/{id}/validate", method = RequestMethod.GET, produces = "application/json")
    public ValidationResult[] validateService(@PathVariable("id") String id) throws IllegalArgumentException, IllegalAccessException {
        Service service = serviceService.findById(id);
        return ValidationUtility.Validate(service, taxonomyService, "service");
    }
    
    @ApiOperation(value = "Validate a single service")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/{id}/validate", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public ValidationResult[] putValidateService(@PathVariable("id") String id, @RequestBody Service service) throws Exception {
        if (serviceService.findById(id) == null)
        {
            throw new Exception("Cannot validate service as no service with this ID exists");
        }
        
        return ValidationUtility.Validate(service, taxonomyService, "service");
    }    
    
    @ApiOperation(value = "Validate service JSON")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/validate", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public ValidationResult[] validateService(@RequestBody Service service) throws Exception {
        return ValidationUtility.Validate(service, taxonomyService, "service", true);
    }    
    
    @ApiOperation(value = "Rating a single service")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/{id}/rate", method = RequestMethod.GET, produces = "application/json")
    public Rating ratingService(@PathVariable("id") String id) throws IllegalArgumentException, IllegalAccessException {
        Service service = serviceService.findById(id);
        return RatingUtility.Rate(service);
    }
    
    @ApiOperation(value = "Rating a single service")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/rate", method = RequestMethod.POST, produces = "application/json")
    public Rating ratingService(@RequestBody Service service) throws IllegalArgumentException, IllegalAccessException {
        return RatingUtility.Rate(service);
    }     
    
    @ApiOperation(value = "Rating a single service")
    @JsonView(ServiceView.class)
    @RequestMapping(value = "/{id}/rate", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Rating putRatingService(@PathVariable("id") String id, @RequestBody Service service) throws Exception {
        if (serviceService.findById(id) == null)
        {
            throw new Exception("Cannot rate service as no service with this ID exists");
        }
        
        return RatingUtility.Rate(service);
    }       
    
    @ApiOperation(value = "Rate a selection of services")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/rate", method = RequestMethod.GET, produces = "application/json")
    public Ratings ratingServices(@RequestParam(required = false, defaultValue = "1") Integer page, @RequestParam(required = false, defaultValue = "50") Integer per_page) throws IllegalArgumentException, IllegalAccessException {
        Page<Service> services = serviceService.findAll(PageRequest.of(page - 1, per_page)); 
        return RatingUtility.Rate(services.getContent());
    }     
}
