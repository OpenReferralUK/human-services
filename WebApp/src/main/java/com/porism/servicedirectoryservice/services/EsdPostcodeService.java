/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.EsdPostcode;
import com.porism.servicedirectoryservice.repositories.EsdPostcodeRepository;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class EsdPostcodeService implements IEsdPostcodeService {
    @Autowired
    private EsdPostcodeRepository repository;            

    @Override
    public EsdPostcode findByCode(String code) {
        return repository.findByCode(code).orElse(null);
    }
}
