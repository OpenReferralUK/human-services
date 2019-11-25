/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Organization;
import java.util.Collection;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface IOrganizationService {
    public List<Organization> findAll();
    public Organization findById(String id);
    public List<Organization> findByIdIn(List<String> ids);
    
    public Organization save(Organization organization);
    public Collection<Organization> saveAll(Collection<Organization> organizations);
}
