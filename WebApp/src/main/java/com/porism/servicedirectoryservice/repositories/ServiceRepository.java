/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Service;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface ServiceRepository extends PagingAndSortingRepository<Service, String> {
    public List<Service> findByServiceTaxonomyCollectionTaxonomyIdIdAndServiceTaxonomyCollectionTaxonomyIdVocabulary(String id, String vocabulary);
    public List<Service> findByIdIn(List<String> ids);
    @Query(value = "SELECT DISTINCT service.*, (IF(`regular_schedule`.id IS NULL,0,1) + IF (`eligibility`.id IS NULL,0,1)) AS quality_score FROM service LEFT OUTER JOIN `regular_schedule` ON `regular_schedule`.service_id = service.id LEFT OUTER JOIN `eligibility` ON `eligibility`.service_id = service.id ORDER BY quality_score DESC",
        countQuery = "SELECT COUNT(service.id) FROM service",
        nativeQuery = true)      
    public Page<Service> findAll(Pageable pageable);    
    @Query(value = "SELECT DISTINCT service.*, (IF(`regular_schedule`.id IS NULL,0,1) + IF (`eligibility`.id IS NULL,0,1)) AS quality_score FROM service LEFT OUTER JOIN `regular_schedule` ON `regular_schedule`.service_id = service.id LEFT OUTER JOIN `eligibility` ON `eligibility`.service_id = service.id WHERE service.id IN ?1 ORDER BY quality_score DESC",
        countQuery = "SELECT COUNT(service.id) FROM service WHERE service.id IN ?1",
        nativeQuery = true)      
    public Page<Service> findByIdIn(List<String> ids, Pageable pageable);
    @Query(value = "SELECT DISTINCT service.*, MATCH(service.name) AGAINST(?2) AS name_score, MATCH(service.description) AGAINST(?2) AS desc_score, (IF(`regular_schedule`.id IS NULL,0,1) + IF (`eligibility`.id IS NULL,0,1)) AS quality_score FROM service LEFT OUTER JOIN `regular_schedule` ON `regular_schedule`.service_id = service.id LEFT OUTER JOIN `eligibility` ON `eligibility`.service_id = service.id WHERE service.id IN ?1 AND MATCH(service.name, service.description) AGAINST(?2 IN BOOLEAN MODE) ORDER BY (name_score*1.5)+desc_score+quality_score DESC",
        countQuery = "SELECT COUNT(service.id) FROM service WHERE service.id IN :serviceIds AND MATCH(service.name, service.description) AGAINST(?2 IN BOOLEAN MODE)",
        nativeQuery = true)    
    public Page<Service> findByIdInAndTextSearch(List<String> ids, String searchText, Pageable pageable);
    @Query(value = "SELECT DISTINCT service.*, MATCH(service.name) AGAINST(?1) AS name_score, MATCH(service.description) AGAINST(?1) AS desc_score, (IF(`regular_schedule`.id IS NULL,0,1) + IF (`eligibility`.id IS NULL,0,1)) AS quality_score FROM service LEFT OUTER JOIN `regular_schedule` ON `regular_schedule`.service_id = service.id LEFT OUTER JOIN `eligibility` ON `eligibility`.service_id = service.id WHERE MATCH(service.name, service.description) AGAINST(?1 IN BOOLEAN MODE) ORDER BY (name_score*1.5)+desc_score+quality_score DESC",
        countQuery = "SELECT COUNT(service.id) FROM service WHERE MATCH(service.name, service.description) AGAINST(?1 IN BOOLEAN MODE)",
        nativeQuery = true)    
    public Page<Service> findByTextSearch(String searchText, Pageable pageable);  
    @Query(value = "SELECT DISTINCT service.id FROM service LEFT OUTER JOIN service_at_location ON service_at_location.service_id = service.id LEFT OUTER JOIN `regular_schedule` ON `regular_schedule`.service_id = service.id OR service_at_location.service_id = service.id WHERE regular_schedule.id IS NULL",    
        nativeQuery = true)      
    public List<String> findAllNonScheduledServices(); 
    @Query(value = "SELECT DISTINCT service.id FROM service LEFT OUTER JOIN `eligibility` ON `eligibility`.service_id = service.id WHERE eligibility.id IS NULL",    
        nativeQuery = true)      
    public List<String> findAllNonEligibleServices();    
    @Query(value = "SELECT DISTINCT service.* FROM service LEFT OUTER JOIN service_at_location ON service.id = service_at_location.service_id LEFT OUTER JOIN location ON location.id = service_at_location.location_id WHERE service.attending_type = 'online' OR ST_Distance_Sphere(point(location.longitude, location.latitude),point(?2, ?1)) <= ?3", nativeQuery = true)
    public List<Service> findByLatitudeLongitude(@Param("aLat") double latitude, @Param("aLong") double longitude, @Param("aDistance") double distance);    
    @Query(value = "SELECT DISTINCT service.* FROM service LEFT OUTER JOIN service_at_location ON service.id = service_at_location.service_id LEFT OUTER JOIN location ON location.id = service_at_location.location_id WHERE service.attending_type = 'online' OR (service.id IN ?4 AND ST_Distance_Sphere(point(location.longitude, location.latitude),point(?2, ?1)) <= ?3)", nativeQuery = true)
    public List<Service> findByLatitudeLongitudeAndService(@Param("aLat") double latitude, @Param("aLong") double longitude, @Param("aDistance") double distance, @Param("serviceIds") List<String> serviceIds);    
}
