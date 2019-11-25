/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.HolidaySchedule;
import com.porism.servicedirectoryservice.repositories.HolidayScheduleRepository;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class HolidayScheduleService implements IHolidayScheduleService {
    @Autowired
    private HolidayScheduleRepository repository;
    
    @Override
    public Collection<HolidaySchedule> saveAll(Collection<HolidaySchedule> holidaySchedules) {
        repository.saveAll(holidaySchedules);
        return holidaySchedules;
    }    
}
