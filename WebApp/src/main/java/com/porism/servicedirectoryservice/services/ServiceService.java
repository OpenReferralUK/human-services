/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.repositories.ServiceRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class ServiceService implements IServiceService {
    @Autowired
    private ServiceRepository repository;   

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
            ids = new ArrayList<String>();
        }        
        return (Page<Service>) repository.findByIdIn(ids, pageable);
    }
    
    @Override
    public Page<Service> findAll(Pageable pageable) {
        return (Page<Service>) repository.findAll(pageable);
    }    
}
