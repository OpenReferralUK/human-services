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
public class RatedItem {
    @JsonView(BasicView.class)
    private String name;
    private Double score;
    @JsonView(BasicView.class)
    private Double percentage;
    
    public RatedItem(String name, Double score)
    {
        this.name = name;
        this.score = score;
    }
    
    public RatedItem(String name, Double score, Double percentage)
    {
        this.name = name;
        this.score = score;
        this.percentage = percentage;
    }    
    
    public void Calculate(Double total)
    {
        this.percentage = BigDecimal.valueOf((score/total)*100)
    .setScale(2, RoundingMode.HALF_UP)
    .doubleValue();
    }
}
