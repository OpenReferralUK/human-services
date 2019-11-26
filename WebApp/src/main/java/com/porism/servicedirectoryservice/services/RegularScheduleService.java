/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.RegularSchedule;
import com.porism.servicedirectoryservice.repositories.RegularScheduleRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Administrator
 */
@org.springframework.stereotype.Service
public class RegularScheduleService implements IRegularScheduleService {
    @Autowired
    private RegularScheduleRepository repository;
    
    @Override
    public Collection<RegularSchedule> saveAll(Collection<RegularSchedule> regularSchedules) {
        repository.saveAll(regularSchedules);
        return regularSchedules;
    }    

    @Override
    public List<RegularSchedule> findByAvailablity(String start, String end, String day) {
        if (day != null && !"".equals(day))
        {
            day = "%" + day + "%";
        }
        else
        {
            day = null;
        }
        if (start == null || "".equals(start))
        {
            start = null;
        }
        if (end == null || "".equals(end))
        {
            end = null;
        }        
        return repository.findByAvailablity(start, end, day);
    }
}
