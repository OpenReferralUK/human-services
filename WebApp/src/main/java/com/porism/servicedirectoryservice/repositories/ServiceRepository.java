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

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface ServiceRepository extends PagingAndSortingRepository<Service, String> {
    public List<Service> findByServiceTaxonomyCollectionTaxonomyIdIdAndServiceTaxonomyCollectionTaxonomyIdVocabulary(String id, String vocabulary);
    public List<Service> findByIdIn(List<String> ids);
    public Page<Service> findByIdIn(List<String> ids, Pageable pageable);
}
