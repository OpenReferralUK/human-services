/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceArea;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface IServiceAreaService {
    public List<ServiceArea> findByIdIn(List<String> ids);
    public List<ServiceArea> findByLatitudeLongitude(double latitude, double longitude);    
}
