/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import com.porism.servicedirectoryservice.repositories.ServiceAtLocationRepository;
import com.porism.servicedirectoryservice.repositories.ServiceTaxonomyRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class ServiceAtLocationService implements IServiceAtLocationService {
    @Autowired
    private ServiceAtLocationRepository repository;

    @Override
    public List<ServiceAtLocation> findByLatitudeLongitude(double latitude, double longitude, double distance) {
        return repository.findByLatitudeLongitude(latitude, longitude, distance);
    }
    
    @Override
    public List<ServiceAtLocation> findByLatitudeLongitudeAndService(double latitude, double longitude, double distance, List<String> serviceIds) {
        return repository.findByLatitudeLongitudeAndService(latitude, longitude, distance, serviceIds);
    }    
}
