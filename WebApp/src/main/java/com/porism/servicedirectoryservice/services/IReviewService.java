/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.Review;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public interface IReviewService {
    public List<Review> findAll();
    public Review findById(String id);
}
