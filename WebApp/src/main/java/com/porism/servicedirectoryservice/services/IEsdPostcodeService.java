/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.EsdPostcode;

/**
 *
 * @author Dominic Skinner
 */
public interface IEsdPostcodeService {
    public EsdPostcode findByCode(String code);
}
