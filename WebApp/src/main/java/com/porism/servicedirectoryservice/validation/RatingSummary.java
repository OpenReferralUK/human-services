/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.validation;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 *
 * @author Dominic Skinner
 */
public class RatingSummary {
    @JsonView(BasicView.class)
    private String id;
    @JsonView(BasicView.class)
    private String name;
    @JsonView(BasicView.class)
    private Double percentage;
    
    public RatingSummary(String id, String name, Double percentage)
    {
        this.name = name;
        this.id = id;
        this.percentage = percentage;
    }
}
