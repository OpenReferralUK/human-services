/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface LinkTaxonomyRepository extends CrudRepository<LinkTaxonomy, String> {
    public List<LinkTaxonomy> findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(String linkType, String id, String vocabulary);
    public List<LinkTaxonomy> findByTaxonomyIdIdAndTaxonomyIdVocabulary(String id, String vocabulary);    
}
