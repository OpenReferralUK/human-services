/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.EsdPostcode;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface EsdPostcodeRepository extends CrudRepository<EsdPostcode, Integer> {
    @Query("SELECT e FROM EsdPostcode e WHERE e.code = :aCode")
    public Optional<EsdPostcode> findByCode(@Param("aCode") String code);
}
