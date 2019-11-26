/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Phone;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Administrator
 */
@Repository
public interface PhoneRepository extends CrudRepository<Phone, String> {
    
}
