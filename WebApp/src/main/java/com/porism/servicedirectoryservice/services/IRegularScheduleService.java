/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.RegularSchedule;
import java.util.Collection;
import java.util.List;

/**
 *
 * @author Administrator
 */
public interface IRegularScheduleService {
    public Collection<RegularSchedule> saveAll(Collection<RegularSchedule> regularSchedules);
    public List<RegularSchedule> findByAvailablity(String start, String end, String day);     
}
