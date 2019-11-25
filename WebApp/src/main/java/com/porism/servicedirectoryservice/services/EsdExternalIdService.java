/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.EsdExternalId;
import com.porism.servicedirectoryservice.repositories.EsdExternalIdRepository;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class EsdExternalIdService implements IEsdExternalIdService {
    @Autowired
    private EsdExternalIdRepository repository;
    
    @Override
    public EsdExternalId save(EsdExternalId esdExternalId) {
        return repository.save(esdExternalId);
    }
    
    @Override
    public String EnsureUUID(String id, String tableName){
        /*
            note that this writes to the esd_external_id table so we don't lose the old id
            pass in null if we can skip this step (only organization, service, location required)
        */
        if (id == null || id.length() == 0) {
            return java.util.UUID.randomUUID().toString();
        }

        Pattern pattern = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
        if (pattern.matcher(id).matches()){
            return id;
        }
        
        String newId = java.util.UUID.randomUUID().toString();
        if (tableName == null){
            return newId;
        }
        EsdExternalId esdExternalId = new EsdExternalId();
        esdExternalId.setUuid(newId);
        esdExternalId.setExternalId(id);
        esdExternalId.setReferenceTable(tableName);
        save(esdExternalId);
        return newId;
    }
}
