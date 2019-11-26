/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.AccessibilityForDisabilities;
import com.porism.servicedirectoryservice.repositories.AccessibilityForDisabilitiesRepository;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class AccessibilityForDisabilitiesService implements IAccessibilityForDisabilitiesService {
    @Autowired
    private AccessibilityForDisabilitiesRepository repository;
    
    @Override
    public Collection<AccessibilityForDisabilities> saveAll(Collection<AccessibilityForDisabilities> accessibilities) {
        repository.saveAll(accessibilities);
        return accessibilities;
    }
    
}
