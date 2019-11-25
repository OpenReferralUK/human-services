/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.AccessibilityForDisabilities;
import com.porism.servicedirectoryservice.models.Contact;
import com.porism.servicedirectoryservice.models.CostOption;
import com.porism.servicedirectoryservice.models.Eligibility;
import com.porism.servicedirectoryservice.models.Funding;
import com.porism.servicedirectoryservice.models.HolidaySchedule;
import com.porism.servicedirectoryservice.models.Language;
import com.porism.servicedirectoryservice.models.Location;
import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.models.Phone;
import com.porism.servicedirectoryservice.models.PhysicalAddress;
import com.porism.servicedirectoryservice.models.RegularSchedule;
import com.porism.servicedirectoryservice.models.Review;
import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.models.ServiceArea;
import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import com.porism.servicedirectoryservice.models.Taxonomy;
import com.porism.servicedirectoryservice.repositories.ServiceRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class ServiceService implements IServiceService {
    @Autowired
    private ServiceRepository repository;   
    @Autowired
    IContactService contactService;
    @Autowired
    ILocationService locationService;
    @Autowired
    IPhysicalAddressService physicalAddressService;
    @Autowired
    IAccessibilityForDisabilitiesService accessibilityForDisabilitiesService;
    @Autowired
    IRegularScheduleService regularScheduleService;
    @Autowired
    IHolidayScheduleService holidayScheduleService;
    @Autowired
    ITaxonomyService taxonomyService;
    @Autowired
    IPhoneService phoneService;
    @Autowired
    IServiceTaxonomyService serviceTaxonomyService;   
    @Autowired
    IServiceAtLocationService serviceAtLocationService;
    @Autowired
    IOrganizationService organizationService;
    @Autowired
    IEsdExternalIdService esdExternalIdService;

    @Override
    public List<Service> findAll() {
        return (List<Service>) repository.findAll();
    }
    
    @Override
    public Service findById(String id) {
        return repository.findById(id).orElse(null);
    }
    
    @Override
    public List<Service> findByIdIn(List<String> ids) {
        if (ids == null)
        {
            return new ArrayList<Service>();
        }
        return (List<Service>) repository.findByIdIn(ids);
    }    

    @Override
    public Page<Service> findByIdIn(List<String> ids, Pageable pageable) {
        if (ids == null)
        {
            return findAll(pageable);
        }        
        if (ids.isEmpty())
        {
            //no matches!
            return new PageImpl<Service>(new ArrayList<Service>());
        }
        return (Page<Service>) repository.findByIdIn(ids, pageable);
    }
    
    @Override
    public Page<Service> findAll(Pageable pageable) {
        return (Page<Service>) repository.findAll(pageable);
    }   

    @Override
    public Page<Service> findByIdInAndTextSearch(List<String> ids, String searchText, Pageable pageable) {
        if (ids == null)
        {
            return (Page<Service>) repository.findByTextSearch(searchText, pageable);
        }
        if (ids.isEmpty())
        {
            //no matches!
            return new PageImpl<Service>(new ArrayList<Service>());
        }
        return (Page<Service>) repository.findByIdInAndTextSearch(ids, searchText, pageable);
    }

    @Override
    public Page<Service> findByTextSearch(String searchText, Pageable pageable) {
        return (Page<Service>) repository.findByTextSearch(searchText, pageable);
    }
    
    @Override
    public List<String> findAllNonScheduledServices(){
        return repository.findAllNonScheduledServices();
    }
    
    @Override
    public List<String> findAllNonEligibleServices(){
        return repository.findAllNonEligibleServices();
    }    
    
    @Override
    public List<Service> findByLatitudeLongitude(double latitude, double longitude, double distance) {
        return repository.findByLatitudeLongitude(latitude, longitude, distance);
    }
    
    @Override
    public List<Service> findByLatitudeLongitudeAndService(double latitude, double longitude, double distance, List<String> serviceIds) {
        return repository.findByLatitudeLongitudeAndService(latitude, longitude, distance, serviceIds);
    }    

    @Override
    public Service save(Service service) {
        List<Location> locations = new ArrayList<>();
        List<RegularSchedule> salRegularSchedules = new ArrayList<>();
        List<HolidaySchedule> salHolidaySchedules = new ArrayList<>();
        List<PhysicalAddress> addresses = new ArrayList<>();
        List<AccessibilityForDisabilities> accessibilitiesForDisabilities = new ArrayList<>();
        List<Phone> phones = new ArrayList<>();
        List<Taxonomy> taxonomies = new ArrayList<>();
        List<Organization> organizations = new ArrayList<>();
        Collection<ServiceAtLocation> serviceAtLocations = CollectionOrEmpty(service.getServiceAtLocationCollection());
        serviceAtLocations.forEach((sal) -> {
            sal.setServiceId(service);
            sal.setId(esdExternalIdService.EnsureUUID(sal.getId(), null));
            Collection<RegularSchedule> salrs = CollectionOrEmpty(sal.getRegularScheduleCollection());
            salrs.forEach((rs) -> {
                rs.setServiceAtLocationId(sal);
                rs.setId(esdExternalIdService.EnsureUUID(rs.getId(), null));
                salRegularSchedules.add(rs);
            });
            sal.setRegularScheduleCollection(Collections.EMPTY_LIST);
            
            Collection<HolidaySchedule> salhs = CollectionOrEmpty(sal.getHolidayScheduleCollection());
            salhs.forEach((hs) -> {
                hs.setServiceAtLocationId(sal);
                hs.setId(esdExternalIdService.EnsureUUID(hs.getId(), null));
                salHolidaySchedules.add(hs);
            });
            sal.setHolidayScheduleCollection(Collections.EMPTY_LIST);
            
            Location location = sal.getLocationId();
            location.setId(esdExternalIdService.EnsureUUID(location.getId(), "location"));
            
            Collection<PhysicalAddress> lAddresses = CollectionOrEmpty(location.getPhysicalAddressCollection());
            lAddresses.forEach((a) -> {
                a.setLocationId(location);
                a.setId(esdExternalIdService.EnsureUUID(a.getId(), null));
                addresses.add(a);
            });
            location.setPhysicalAddressCollection(Collections.EMPTY_LIST);
            
            Collection<AccessibilityForDisabilities> lAccessibilities = CollectionOrEmpty(location.getAccessibilityForDisabilitiesCollection());
            lAccessibilities.forEach((a) -> {
                a.setLocationId(location);
                a.setId(esdExternalIdService.EnsureUUID(a.getId(), null));
                accessibilitiesForDisabilities.add(a);
            });
            location.setPhysicalAddressCollection(Collections.EMPTY_LIST);
            
            locations.add(location);
        });
        Collection<Contact> contacts = CollectionOrEmpty(service.getContactCollection());
        contacts.forEach((c) -> {
            c.setServiceId(service);
            c.setId(esdExternalIdService.EnsureUUID(c.getId(), null));
            Collection<Phone> cPhones = CollectionOrEmpty(c.getPhoneCollection());
            cPhones.forEach((p) -> {
                p.setContactId(c);
                p.setId(esdExternalIdService.EnsureUUID(p.getId(), null));
                phones.add(p);
            });
            c.setPhoneCollection(Collections.EMPTY_LIST);
        });
        Collection<ServiceTaxonomy> serviceTaxonomies = CollectionOrEmpty(service.getServiceTaxonomyCollection());
        serviceTaxonomies.forEach((st) -> {
            st.setServiceId(service);
            st.setId(esdExternalIdService.EnsureUUID(st.getId(), null));
            taxonomies.add(st.getTaxonomyId());
        });        
        Collection<ServiceArea> serviceAreas = CollectionOrEmpty(service.getServiceAreaCollection());
        serviceAreas.forEach((sa) -> {
            sa.setServiceId(service); 
            sa.setId(esdExternalIdService.EnsureUUID(sa.getId(), null));
        });        
        Collection<Funding> fundings = CollectionOrEmpty(service.getFundingCollection());
        fundings.forEach((f) -> {
            f.setServiceId(service);
            f.setId(esdExternalIdService.EnsureUUID(f.getId(), null));
        });        
        Collection<RegularSchedule> regularSchedules = CollectionOrEmpty(service.getRegularScheduleCollection());
        regularSchedules.forEach((rs) -> {
            rs.setServiceId(service);
            rs.setId(esdExternalIdService.EnsureUUID(rs.getId(), null));
        });        
        Collection<HolidaySchedule> holidaySchedules = CollectionOrEmpty(service.getHolidayScheduleCollection());
        holidaySchedules.forEach((hs) -> {
            hs.setServiceId(service);
            hs.setId(esdExternalIdService.EnsureUUID(hs.getId(), null));
        });        
        Collection<Eligibility> eligibilities = CollectionOrEmpty(service.getEligibilityCollection());
        eligibilities.forEach((e) -> {
            e.setServiceId(service);
            e.setId(esdExternalIdService.EnsureUUID(e.getId(), null));
        });    
        Collection<CostOption> costOptions = CollectionOrEmpty(service.getCostOptionCollection());
        costOptions.forEach((co) -> {
            co.setServiceId(service);
            co.setId(esdExternalIdService.EnsureUUID(co.getId(), null));
        });    
        Collection<Review> reviews = CollectionOrEmpty(service.getReviewCollection());
        reviews.forEach((r) -> {
            r.setServiceId(service);
            r.setId(esdExternalIdService.EnsureUUID(r.getId(), null));
            Organization organization = r.getReviewerOrganizationId();
            organization.setId(esdExternalIdService.EnsureUUID(organization.getId(), "organization"));
            organizations.add(organization);
        });    
        Collection<Language> languages = CollectionOrEmpty(service.getLanguageCollection());
        languages.forEach((l) -> {
            l.setServiceId(service);
            l.setId(esdExternalIdService.EnsureUUID(l.getId(), null));
        });
                
        service.setServiceAtLocationCollection(Collections.EMPTY_LIST);
        service.setContactCollection(Collections.EMPTY_LIST);
        service.setServiceTaxonomyCollection(Collections.EMPTY_LIST);
        
        locationService.saveAll(locations);
        physicalAddressService.saveAll(addresses);
        accessibilityForDisabilitiesService.saveAll(accessibilitiesForDisabilities);
        taxonomyService.saveAll(taxonomies);
        organizationService.saveAll(organizations);
        
        repository.save(service);
        
        serviceAtLocationService.saveAll(serviceAtLocations);
        regularScheduleService.saveAll(salRegularSchedules);
        holidayScheduleService.saveAll(salHolidaySchedules);
        contactService.saveAll(contacts);
        serviceTaxonomyService.saveAll(serviceTaxonomies);
        phoneService.saveAll(phones);        
        
        return findById(service.getId());
    }

    @Override
    public Collection<Service> saveAll(Collection<Service> services) {
        if (services == null) return Collections.EMPTY_LIST;
        
        //loop rather than call repository.saveAll as more happens in save than just saving to repo
        Collection<Service> saved = new ArrayList<>();
        services.forEach((s) -> {
            s.setId(esdExternalIdService.EnsureUUID(s.getId(), "service"));
            saved.add(save(s));
        });
        return saved;
    }
    
    private Collection CollectionOrEmpty(Collection input){
        return input == null ? Collections.EMPTY_LIST : input;
    }
}
