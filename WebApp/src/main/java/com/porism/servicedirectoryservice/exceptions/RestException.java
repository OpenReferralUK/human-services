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
public abstract class RestException extends Exception {
    private final ExceptionCode errorCode;
    private final String errorMessage;
    
    public RestException(String message){
        errorCode = errorCode();
        errorMessage = message;
    }
    
    protected abstract ExceptionCode errorCode();
    
    public int getErrorCode()
    {
        return errorCode.getNumVal();
    }
    
    public String getErrorMessage()
    {
        return errorMessage;
    }
    
    public ExceptionResponse getResponse(){
        return new ExceptionResponse(this);
    }
}