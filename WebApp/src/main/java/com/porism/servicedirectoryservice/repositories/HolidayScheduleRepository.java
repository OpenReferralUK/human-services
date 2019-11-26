/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.HolidaySchedule;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Administrator
 */
@Repository
public interface HolidayScheduleRepository extends CrudRepository<HolidaySchedule, String> {
    
}
