/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.CostOption;
import com.porism.servicedirectoryservice.repositories.CostOptionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class CostOptionService implements ICostOptionService {
    @Autowired
    private CostOptionRepository repository;    

    @Override
    public List<CostOption> findByIdIn(List<String> ids) {
        return repository.findByIdIn(ids);
    }
}
