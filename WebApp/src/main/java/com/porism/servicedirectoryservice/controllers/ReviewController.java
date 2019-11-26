/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.models.Review;
import com.porism.servicedirectoryservice.services.IEsdExternalIdService;
import com.porism.servicedirectoryservice.services.IReviewService;
import com.porism.servicedirectoryservice.utilities.ResponseUtility;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.porism.servicedirectoryservice.views.ReviewBasicView;
import com.porism.servicedirectoryservice.views.ReviewView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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
    @Autowired
    IEsdExternalIdService esdExternalIdService;
        
    @ApiOperation(value = "Get all reviews", notes = "Note that the objects returned by this method contains a subset of the properties shown in the example.")
    @JsonView(ReviewBasicView.class)
    @RequestMapping(value = {"", ".json", ".csv", "/.json", "/.csv"}, method = RequestMethod.GET, produces = "application/json")
    public Review[] getReviews(HttpServletResponse response, HttpServletRequest request) throws IllegalArgumentException, IOException, Exception {
        List<Review> reviews = reviewService.findAll();
        return ResponseUtility.HandleResponse(request, response, reviews.toArray(new Review[reviews.size()]), ReviewBasicView.class);
    }   
    
    @ApiOperation(value = "Get a single review")
    @JsonView(ReviewView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public Review getReview(HttpServletResponse response, HttpServletRequest request, @PathVariable("id") String id) throws IllegalArgumentException, IOException, Exception {
        return ResponseUtility.HandleResponse(request, response, reviewService.findById(id), ReviewView.class);
    }
    
    @ApiOperation(value = "Create a review")
    @JsonView(ReviewView.class)
    @RequestMapping(value = "/", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public Review postReview(@RequestBody Review review) throws Exception {
        review.setId(esdExternalIdService.EnsureUUID(review.getId(), null));
        if (reviewService.findById(review.getId()) != null)
        {
            throw new Exception("Cannot create review as a review with this ID already exists");
        }
        
        return reviewService.save(review);
    }   
    
    @ApiOperation(value = "Update a review")
    @JsonView(ReviewView.class)
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = "application/json", produces = "application/json")
    public Review putReview(@PathVariable("id") String id, @RequestBody Review review) throws Exception {
        if (reviewService.findById(id) == null)
        {
            throw new Exception("Cannot update review as no review with this ID exists");
        }
        
        return reviewService.save(review);
    }
}
