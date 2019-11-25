/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Contact;
import com.porism.servicedirectoryservice.repositories.ContactRepository;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class ContactService implements IContactService {
    @Autowired
    private ContactRepository repository;

    @Override
    public Collection<Contact> saveAll(Collection<Contact> contacts) {
        repository.saveAll(contacts);
        return contacts;
    }
}
