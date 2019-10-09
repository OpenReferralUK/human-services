/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Taxonomy;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface ITaxonomyService {
    public List<Taxonomy> findAll();
    public Taxonomy findById(String id);
    public List<Taxonomy> findByVocabulary(String vocabulary); 
    public List<String> findDistinctVocabulary();
}
