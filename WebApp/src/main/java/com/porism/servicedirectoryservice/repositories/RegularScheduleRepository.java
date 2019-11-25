/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.RegularSchedule;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Administrator
 */
@Repository
public interface RegularScheduleRepository extends CrudRepository<RegularSchedule, String> {
    @Query(value = "SELECT regular_schedule.* FROM regular_schedule WHERE (valid_from IS NULL OR valid_from <= CURDATE()) AND (valid_to IS NULL OR valid_to >= CURDATE()) AND (?1 IS NULL OR `opens_at` >= ?1) AND (?2 IS NULL OR `closes_at` <= ?2) AND (?3 IS NULL OR byday LIKE ?3)",    
    nativeQuery = true)    
    public List<RegularSchedule> findByAvailablity(String start, String end, String day);     
}