/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.services;

import com.porism.servicedirectoryservice.models.HolidaySchedule;
import java.util.Collection;

/**
 *
 * @author Administrator
 */
public interface IHolidayScheduleService {
    public Collection<HolidaySchedule> saveAll(Collection<HolidaySchedule> holidaySchedules);
}
