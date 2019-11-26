/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Organization;
import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.repositories.OrganizationRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class OrganizationService implements IOrganizationService {
    @Autowired
    private OrganizationRepository repository;   
    @Autowired
    IServiceService serviceService;
    
    @Override
    public List<Organization> findAll() {
        return (List<Organization>) repository.findAll();
    }
    
    @Override
    public Organization findById(String id) {
        return repository.findById(id).orElse(null);
    }    

    @Override
    public List<Organization> findByIdIn(List<String> ids) {
        return repository.findByIdIn(ids);
    }

    @Override
    public Organization save(Organization organization) {
        Collection<Service> services = organization.getServiceCollection();
        if (services != null){
            services.forEach((s) -> s.setOrganizationId(organization));
        }
        organization.setServiceCollection(Collections.EMPTY_LIST);
        repository.save(organization);
        if (services != null){
            serviceService.saveAll(services);
        }
        return findById(organization.getId());
    }

    @Override
    public Collection<Organization> saveAll(Collection<Organization> organizations) {
        repository.saveAll(organizations);
        return organizations;
    }
}
