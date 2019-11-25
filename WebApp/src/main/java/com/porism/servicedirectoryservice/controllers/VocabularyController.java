/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.services.ITaxonomyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Dominic Skinner
 */

@Api(tags = "Vocabularies")
@RestController
@RequestMapping("/vocabularies")
public class VocabularyController {
    @Autowired
    ITaxonomyService taxonomyService;

    @ApiOperation(value = "Get all vocabularies")
    @JsonView(BasicView.class)
    @RequestMapping(value = "", method = RequestMethod.GET, produces = "application/json")
    public String[] getVocabularies() {
        List<String> values = taxonomyService.findDistinctVocabulary();
        return values.toArray(new String[values.size()]);
    }   
}
