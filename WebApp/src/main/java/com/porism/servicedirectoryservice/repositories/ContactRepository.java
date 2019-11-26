/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Contact;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Administrator
 */
@Repository
public interface ContactRepository extends CrudRepository<Contact, String> {

}
