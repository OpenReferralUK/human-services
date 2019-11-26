/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Review;
import com.porism.servicedirectoryservice.repositories.ReviewRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Dominic Skinner
 */
@org.springframework.stereotype.Service
public class ReviewService implements IReviewService {
    @Autowired
    private ReviewRepository repository;   

    @Override
    public List<Review> findAll() {
        return (List<Review>) repository.findAll();
    }
    
    @Override
    public Review findById(String id) {
        return repository.findById(id).orElse(null);
    }    

    @Override
    public Review save(Review review) {
        return repository.save(review);
    }
}
