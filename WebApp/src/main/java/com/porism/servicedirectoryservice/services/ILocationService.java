/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Location;
import java.util.Collection;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface ILocationService {
    public List<Location> findAll();
    public Location findById(String id);
    
    public Location save(Location location);
    public Collection<Location> saveAll(Collection<Location> locations);
}
