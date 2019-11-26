/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Taxonomy;
import com.porism.servicedirectoryservice.repositories.TaxonomyRepository;
import java.util.Collection;
import com.porism.servicedirectoryservice.utilities.RepositoryUtility;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class TaxonomyService implements ITaxonomyService {
    @Autowired
    private TaxonomyRepository repository;   

    @Override
    public List<Taxonomy> findAll() {
        return (List<Taxonomy>) repository.findAll();
    }
    
    @Override
    public Page<Taxonomy> findAll(Pageable pageable) {
        return (Page<Taxonomy>) repository.findAll(pageable);
    }      
    
    @Override
    public Taxonomy findById(String id) {
        return repository.findById(id).orElse(null);
    }    

    @Override
    public Page<Taxonomy> findByVocabularyAndParentIdAndSearch(List<String> taxonomyIds, String text, String vocabulary, String parent_id, boolean root_only, Pageable pageable)
    {
        if (text != null && !"".equals(text))
        {
            return repository.findByTextSearch(text, RepositoryUtility.emptyToNull(vocabulary), RepositoryUtility.emptyToNull(parent_id), RepositoryUtility.emptyToNull(taxonomyIds), root_only, pageable);                        
        }
        return repository.findByVocabularyAndParentId(RepositoryUtility.emptyToNull(vocabulary), RepositoryUtility.emptyToNull(parent_id), RepositoryUtility.emptyToNull(taxonomyIds), root_only, pageable);
    }  
    
    @Override
    public List<String> findDistinctVocabulary()
    {
        return repository.findDistinctVocabulary();
    }
    
    @Override
    public Taxonomy save(Taxonomy taxonomy) {
        repository.save(taxonomy);
        return taxonomy;
    }
    
    @Override
    public Collection<Taxonomy> saveAll(Collection<Taxonomy> taxonomies) {
        repository.saveAll(taxonomies);
        return taxonomies;
    }

    @Override
    public List<String> findIdsByNeed(List<String> needs) {
        if (needs == null || needs.isEmpty())
        {
            return new ArrayList<String>();
        }        
        return repository.findIdsByNeed(needs);
    }

    @Override
    public List<String> findIdsByCircumstance(List<String> circumstances) {
        if (circumstances == null || circumstances.isEmpty())
        {
            return new ArrayList<String>();
        }
        return repository.findIdsByCircumstance(circumstances);
    }
    
    @Override
    public int countByVocabularyAndTerms(String vocabulary, List<String> terms)
    {
        if (terms == null || terms.isEmpty())
        {
            return 0;
        }
        return repository.countByVocabularyAndTerms(vocabulary, terms);        
    }
}
