/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 *
 * @author Dominic Skinner
 */
public interface IServiceService {
    public List<Service> findAll();
    public Service findById(String id);
    public List<Service> findByIdIn(List<String> ids);
    public Page<Service> findByIdIn(List<String> ids, Pageable pageable);
    public Page<Service> findAll(Pageable pageable);
}
