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
public class ExceptionResponse {    
    private String error;
    public int code;

    public ExceptionResponse(RestException exception) {
        this.error = exception.getErrorMessage();
        this.code = exception.getErrorCode();
    }

    public String getError() {
        return error;
    }

    public int getCode() {
        return code;
    }
}
