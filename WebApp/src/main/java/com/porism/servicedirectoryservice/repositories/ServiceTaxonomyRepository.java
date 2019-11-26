/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface ServiceTaxonomyRepository extends CrudRepository<ServiceTaxonomy, String> {
    public List<ServiceTaxonomy> findByTaxonomyIdIdAndTaxonomyIdVocabulary(String id, String vocabulary);
    @Query(value = "SELECT service_taxonomy.* FROM service_taxonomy WHERE service_taxonomy.taxonomy_id IN (SELECT `esd_link`.`taxonomy_id` FROM `esd_link` WHERE `esd_link`.`need_id` = ?1)",    
    nativeQuery = true)    
    public List<ServiceTaxonomy> findByNeed(String need);
    @Query(value = "SELECT service_taxonomy.* FROM service_taxonomy WHERE service_taxonomy.taxonomy_id IN (SELECT `esd_link`.`taxonomy_id` FROM `esd_link` WHERE `esd_link`.`circumstance_id` = ?1)",    
    nativeQuery = true)    
    public List<ServiceTaxonomy> findByCircumstance(String circumstance);     
}
