/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface IServiceAtLocationService {
    public List<ServiceAtLocation> findByLatitudeLongitude(double latitude, double longitude, double distance);    
}
