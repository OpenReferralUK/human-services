/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Taxonomy;
import com.porism.servicedirectoryservice.repositories.TaxonomyRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

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
    public Taxonomy findById(String id) {
        return repository.findById(id).orElse(null);
    }    

    @Override
    public List<Taxonomy> findByVocabulary(String vocabulary) {
        return (List<Taxonomy>) repository.findByVocabularyOrderByIdAsc(vocabulary);
    }
    
    @Override
    public List<String> findDistinctVocabulary(){
        return repository.findDistinctVocabulary();
    }            
}
