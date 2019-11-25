/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.validation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public class Rating {
    @JsonView(BasicView.class)
    public List<RatedItem> populated = new ArrayList<RatedItem>();
    @JsonView(BasicView.class)
    @JsonProperty("not_populated")
    public List<RatedItem> notPopulated = new ArrayList<RatedItem>();
    @JsonView(BasicView.class)
    @JsonProperty("richness_percentage")
    public double richnessPercentage;
    @JsonIgnore
    private double richnessScore;
    @JsonIgnore
    private double richnessTotal;
    
    
    public Rating(){
    } 
    
    public void Add(Rating obj)
    {
        this.getPopulated().addAll(obj.getPopulated()); 
        this.getNotPopulated().addAll(obj.getNotPopulated()); 
        this.richnessTotal += obj.getRichnessTotal();
        this.richnessScore += obj.getRichnessScore();     
    }

    public void Calculate() {
        if (this.getRichnessTotal() > 0)
        {
            this.richnessPercentage = BigDecimal.valueOf((this.getRichnessScore()/this.getRichnessTotal())*100)
    .setScale(2, RoundingMode.HALF_UP)
    .doubleValue();
            for(RatedItem item : populated)
            {
                item.Calculate(this.getRichnessTotal());
            }
            for(RatedItem item : notPopulated)
            {
                item.Calculate(this.getRichnessTotal());
            }            
        }
    }
 
    public void AddPopulated(String field, Double score)
    {
        this.getPopulated().add(new RatedItem(field, score));     
    } 
    
    public void AddNonPopulated(String field, Double score)
    {
        this.getNotPopulated().add(new RatedItem(field, score));     
    } 

    public void AddRichnessScore(double richnessScore) {
        this.richnessScore += richnessScore;
    }

    public void AddRichnessTotal(double richnessCount) {
        this.richnessTotal += richnessCount;
    }

    /**
     * @return the richnessScore
     */
    public double getRichnessScore() {
        return richnessScore;
    }

    /**
     * @return the richnessTotal
     */
    public double getRichnessTotal() {
        return richnessTotal;
    }

    /**
     * @return the populated
     */
    public List<RatedItem> getPopulated() {
        return populated;
    }

    /**
     * @return the notPopulated
     */
    public List<RatedItem> getNotPopulated() {
        return notPopulated;
    }

    /**
     * @return the richnessPercentage
     */
    public double getRichnessPercentage() {
        return richnessPercentage;
    }
}
