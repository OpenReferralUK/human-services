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
public enum ExceptionCode {
    MissingParameter(1);
    
    private int numVal;

    ExceptionCode(int numVal) {
        this.numVal = numVal;
    }

    public int getNumVal() {
        return numVal;
    }
}
