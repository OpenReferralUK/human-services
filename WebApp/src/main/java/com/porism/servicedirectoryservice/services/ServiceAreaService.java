/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceArea;
import com.porism.servicedirectoryservice.repositories.ServiceAreaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class ServiceAreaService implements IServiceAreaService {
    @Autowired
    private ServiceAreaRepository repository;    

    @Override
    public List<ServiceArea> findByIdIn(List<String> ids) {
        return repository.findByIdIn(ids);
    }

    @Override
    public List<ServiceArea> findByLatitudeLongitude(double latitude, double longitude) {
        return repository.findByLatitudeLongitude(latitude, longitude);
    }
}
