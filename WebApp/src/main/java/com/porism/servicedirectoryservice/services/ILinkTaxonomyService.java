/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface ILinkTaxonomyService {
    public List<LinkTaxonomy> findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(String linkType, String id, String vocabulary);    
}
