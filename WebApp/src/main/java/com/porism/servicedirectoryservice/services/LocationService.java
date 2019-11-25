/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Location;
import com.porism.servicedirectoryservice.repositories.LocationRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class LocationService implements ILocationService {
    @Autowired
    private LocationRepository repository;   

    @Override
    public List<Location> findAll() {
        return (List<Location>) repository.findAll();
    }
    
    @Override
    public Location findById(String id) {
        return repository.findById(id).orElse(null);
    }    

    @Override
    public Collection<Location> saveAll(Collection<Location> locations) {
        repository.saveAll(locations);
        return locations;
    }

    @Override
    public Location save(Location location) {
        return repository.save(location);
    }
}
