/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Location;
import com.porism.servicedirectoryservice.services.ILocationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.LocationView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Dominic Skinner
 */

@Api(tags = "Locations")
@RestController
@RequestMapping("/locations")
public class LocationController {
    @Autowired
    ILocationService locationService;
        
    @ApiOperation(value = "Get all locations", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public Location[] getLocations() {
        List<Location> locations = locationService.findAll();
        return locations.toArray(new Location[locations.size()]);
    }   
    
    @ApiOperation(value = "Get a single location")
    @JsonView(LocationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Location getLocation(@PathVariable("id") String id) {
        return locationService.findById(id);
    }      
}
