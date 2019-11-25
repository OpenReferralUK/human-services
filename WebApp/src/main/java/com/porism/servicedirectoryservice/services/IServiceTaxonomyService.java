/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.ServiceTaxonomy;
import java.util.Collection;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface IServiceTaxonomyService {
    public List<ServiceTaxonomy> findByTaxonomyIdIdAndTaxonomyIdVocabulary(String id, String vocabulary);
    
    public Collection<ServiceTaxonomy> saveAll(Collection<ServiceTaxonomy> serviceTaxonomies);
    public List<ServiceTaxonomy> findByNeed(String need);
    public List<ServiceTaxonomy> findByCircumstance(String circumstance);
}
