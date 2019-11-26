/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.PhysicalAddress;
import com.porism.servicedirectoryservice.repositories.PhysicalAddressRepository;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class PhysicalAddressService implements IPhysicalAddressService {
    @Autowired
    private PhysicalAddressRepository repository;

    @Override
    public Collection<PhysicalAddress> saveAll(Collection<PhysicalAddress> physicalAddresses) {
        repository.saveAll(physicalAddresses);
        return physicalAddresses;
    }    
}
