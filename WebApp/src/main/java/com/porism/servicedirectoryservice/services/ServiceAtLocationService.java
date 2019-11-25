/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import com.porism.servicedirectoryservice.repositories.ServiceAtLocationRepository;
import java.util.Collection;
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
    public Collection<ServiceAtLocation> saveAll(Collection<ServiceAtLocation> serviceAtLocations) {
        repository.saveAll(serviceAtLocations);
        return serviceAtLocations;
    }   
}
