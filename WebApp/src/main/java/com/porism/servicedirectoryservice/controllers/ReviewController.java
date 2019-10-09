/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Review;
import com.porism.servicedirectoryservice.services.IReviewService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.ReviewView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author Dominic Skinner
 */
@Api(tags = "Reviews")
@RestController
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    IReviewService reviewService;
        
    @ApiOperation(value = "Get all reviews", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(BasicView.class)
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
    public Review[] getReviews() {
        List<Review> reviews = reviewService.findAll();
        return reviews.toArray(new Review[reviews.size()]);
    }   
    
    @ApiOperation(value = "Get a single review")
    @JsonView(ReviewView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Review getReview(@PathVariable("id") String id) {
        return reviewService.findById(id);
    }      
}
