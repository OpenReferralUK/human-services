/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.validation;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import java.io.Serializable;

/**
 *
 * @author Dominic Skinner
 */
public class ValidationResult implements Serializable {
    @JsonView(BasicView.class)
    public String message;
    
    public ValidationResult(String message){
        this.message = message;
    }
}
