/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Service;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
public interface IServiceService {
    public List<Service> findAll();
    public Service findById(String id);
    public List<Service> findByIdIn(List<String> ids);
    public Page<Service> findByIdIn(List<String> ids, Pageable pageable);
    public Page<Service> findAll(Pageable pageable);
    public Page<Service> findByIdInAndTextSearch(List<String> ids, String searchText, Pageable pageable);
    public Page<Service> findByTextSearch(String searchText, Pageable pageable);
    public List<String> findAllNonScheduledServices(); 
    public List<String> findAllNonEligibleServices();
    public Service save(Service service);
    public Collection<Service> saveAll(Collection<Service> services);
    public List<Service> findByLatitudeLongitude(double latitude, double longitude, double distance);    
    public List<Service> findByLatitudeLongitudeAndService(double latitude, double longitude, double distance, List<String> serviceIds);
}
