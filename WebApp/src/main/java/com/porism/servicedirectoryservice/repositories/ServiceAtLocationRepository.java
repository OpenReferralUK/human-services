/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.ServiceAtLocation;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface ServiceAtLocationRepository extends CrudRepository<ServiceAtLocation, String> {
    @Query("SELECT s FROM ServiceAtLocation s INNER JOIN Location l ON l.id = s.locationId.id LEFT OUTER JOIN PhysicalAddress p ON p.locationId.id = l.id WHERE p.id IS NULL OR ST_Distance_Sphere(point(l.longitude, l.latitude),point(:aLong, :aLat)) <= :aDistance")
    public List<ServiceAtLocation> findByLatitudeLongitude(@Param("aLat") double latitude, @Param("aLong") double longitude, @Param("aDistance") double distance);
    
    @Query("SELECT s FROM ServiceAtLocation s INNER JOIN Location l ON l.id = s.locationId.id LEFT OUTER JOIN PhysicalAddress p ON p.locationId.id = l.id WHERE p.id IS NULL OR (s.serviceId.id IN :serviceIds AND ST_Distance_Sphere(point(l.longitude, l.latitude),point(:aLong, :aLat)) <= :aDistance)")
    public List<ServiceAtLocation> findByLatitudeLongitudeAndService(@Param("aLat") double latitude, @Param("aLong") double longitude, @Param("aDistance") double distance, @Param("serviceIds") List<String> serviceIds);    
}
