/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Location;
import com.porism.servicedirectoryservice.services.IEsdExternalIdService;
import com.porism.servicedirectoryservice.services.ILocationService;
import com.porism.servicedirectoryservice.utilities.ResponseUtility;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.LocationView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    @Autowired
    IEsdExternalIdService esdExternalIdService; 
        
    @ApiOperation(value = "Get all locations", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(BasicView.class)
    @RequestMapping(value = {"", ".json", ".csv", "/.json", "/.csv"}, method = RequestMethod.GET, produces = "application/json")
    public Location[] getLocations(HttpServletResponse response, HttpServletRequest request) throws IllegalArgumentException, IOException, Exception {
        List<Location> locations = locationService.findAll();
        return ResponseUtility.HandleResponse(request, response, locations.toArray(new Location[locations.size()]), BasicView.class);
    }   
    
    @ApiOperation(value = "Get a single location")
    @JsonView(LocationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Location getLocation(HttpServletResponse response, HttpServletRequest request, @PathVariable("id") String id) throws IllegalArgumentException, IOException, Exception {
        return ResponseUtility.HandleResponse(request, response, locationService.findById(id), BasicView.class);
    }
    
    @ApiOperation(value = "Create a location")
    @JsonView(LocationView.class)
    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public Location postLocation(@RequestBody Location location) throws Exception {
        location.setId(esdExternalIdService.EnsureUUID(location.getId(), "location"));
        if (locationService.findById(location.getId()) != null)
        {
            throw new Exception("Cannot create location as a location with this ID already exists");
        }
        
        return locationService.save(location);
    }   
    
    @ApiOperation(value = "Update a location")
    @JsonView(LocationView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Location putLocation(@PathVariable("id") String id, @RequestBody Location location) throws Exception {
        if (locationService.findById(id) == null)
        {
            throw new Exception("Cannot update location as no location with this ID exists");
        }
        
        return locationService.save(location);
    }
}
