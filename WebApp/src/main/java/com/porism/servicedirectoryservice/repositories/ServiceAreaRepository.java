/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.ServiceArea;
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
public interface ServiceAreaRepository extends CrudRepository<ServiceArea, String> {
    public List<ServiceArea> findByIdIn(List<String> ids);
    @Query(value = "SELECT * FROM service_area WHERE ST_Contains(service_area.extent, ST_GeomFromText(CONCAT('POINT(',:aLong,' ',:aLat,')'), 4326))", 
  nativeQuery = true)
    public List<ServiceArea> findByLatitudeLongitude(@Param("aLat") double latitude, @Param("aLong") double longitude);    
}
