/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface ServiceTaxonomyRepository extends CrudRepository<ServiceTaxonomy, String> {
    public List<ServiceTaxonomy> findByTaxonomyIdIdAndTaxonomyIdVocabulary(String id, String vocabulary);
}
