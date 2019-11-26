/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Phone;
import java.util.Collection;

/**
 *
 * @author Administrator
 */
public interface IPhoneService {
    public Collection<Phone> saveAll(Collection<Phone> phones);
}
