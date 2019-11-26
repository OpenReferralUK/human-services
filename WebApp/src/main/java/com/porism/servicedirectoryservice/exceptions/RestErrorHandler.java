/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.porism.servicedirectoryservice.validation.ValidationResult;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Dominic Skinner
 */
@ControllerAdvice
public class RestErrorHandler {
    @ExceptionHandler(MissingParameterException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Object processMissingParameterError(MissingParameterException ex) {
        return ex.getResponse();
    }  
    
    @ExceptionHandler(InvalidFormatException.class)
    @ResponseBody
    public Object processInvalidFormatError(InvalidFormatException ex) {
        List<ValidationResult> results = new ArrayList<ValidationResult>();
        results.add(new ValidationResult(ex.getMessage()));
        return results.toArray(new ValidationResult[results.size()]);        
    }     
}
