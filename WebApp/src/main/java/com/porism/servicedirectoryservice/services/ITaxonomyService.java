/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Taxonomy;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
public interface ITaxonomyService {
    public List<Taxonomy> findAll();
    public Page<Taxonomy> findAll(Pageable pageable);
    public Taxonomy findById(String id);
    public Page<Taxonomy> findByVocabularyAndParentIdAndSearch(List<String> taxonomyIds, String text, String vocabulary, String parent_id, boolean root_only, Pageable pageable);
    public List<String> findDistinctVocabulary();
    
    public Collection<Taxonomy> saveAll(Collection<Taxonomy> taxonomies);
    public Taxonomy save(Taxonomy taxonomy);
    
    public List<String> findIdsByNeed(List<String> needs);
    public List<String> findIdsByCircumstance(List<String> circumstances);
    public int countByVocabularyAndTerms(String vocabulary, List<String> terms);
}
