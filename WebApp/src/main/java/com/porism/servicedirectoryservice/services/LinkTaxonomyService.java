/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.LinkTaxonomy;
import com.porism.servicedirectoryservice.repositories.LinkTaxonomyRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class LinkTaxonomyService implements ILinkTaxonomyService {
    @Autowired
    private LinkTaxonomyRepository repository;   

    @Override
    public List<LinkTaxonomy> findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(String linkType, String id, String vocabulary) {
        return (List<LinkTaxonomy>) repository.findByLinkTypeAndTaxonomyIdIdAndTaxonomyIdVocabulary(linkType, id, vocabulary);
    }
}
