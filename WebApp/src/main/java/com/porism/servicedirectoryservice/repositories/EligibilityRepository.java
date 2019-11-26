/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Eligibility;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface EligibilityRepository extends CrudRepository<Eligibility, String> {
    public List<Eligibility> findByIdIn(List<String> ids);
    @Query(value = "SELECT DISTINCT service_id FROM `eligibility` WHERE (?1 IS NULL OR minimum_age >= ?1) AND (?2 IS NULL OR maximum_age <= ?2)",    
        nativeQuery = true)      
    public List<String> findByAge(Float min_age, Float max_age);        
}
