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
public class Ratings {
    @JsonView(BasicView.class)
    @JsonProperty("sample_size")
    private int sampleSize;
    @JsonIgnore
    private Double richnessTotal = 0.0;
    @JsonView(BasicView.class)
    @JsonProperty("richness_percentage")
    private double richnessPercentage;
    @JsonView(BasicView.class)
    private List<RatingSummary> ratings;
    
    public Ratings()
    {
        this.ratings = new ArrayList<RatingSummary>();
    }
    
    public void Add(String id, String name, Double richness)
    {
        this.ratings.add(new RatingSummary(id, name, richness));
        sampleSize++;
        richnessTotal += richness;
        this.richnessPercentage = BigDecimal.valueOf((richnessTotal/sampleSize))
    .setScale(2, RoundingMode.HALF_UP)
    .doubleValue();
    }
}
