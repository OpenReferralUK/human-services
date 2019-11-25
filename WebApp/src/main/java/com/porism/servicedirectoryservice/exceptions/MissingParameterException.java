/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.exceptions;

/**
 *
 * @author Dominic Skinner
 */
public class MissingParameterException extends RestException{
    public MissingParameterException(String name) {
        super(String.format("Required parameter '%s' is missing.", name));
    }

    @Override
    protected ExceptionCode errorCode() {
        return ExceptionCode.MissingParameter;
    }    
}
