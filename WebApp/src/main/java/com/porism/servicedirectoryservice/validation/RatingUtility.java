/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.validation;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.HashSet;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.porism.servicedirectoryservice.models.Service;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public class RatingUtility {    
    public static Ratings Rate(List<Service> targetObjects) throws IllegalArgumentException, IllegalAccessException{
        if (targetObjects == null){            
            return null;
        }        
        
        Ratings ratings = new Ratings();
        
        for(Service service : targetObjects)
        {
            Rating rating = Rate(service, service.getClass(), new HashSet<Class<?>>());
            rating.Calculate();
            ratings.Add(service.getId(), service.getName(), rating.getRichnessPercentage());
        }
        
        return ratings;
    }     
    
    public static Rating Rate(Object targetObject) throws IllegalArgumentException, IllegalAccessException{
        if (targetObject == null){            
            return null;
        }        
        
        Rating rating = Rate(targetObject, targetObject.getClass(), new HashSet<Class<?>>());
        rating.Calculate();
        
        return rating;
    }     
    
    private static Rating Rate(Object targetObject, Class<?> clazz, HashSet<Class<?>> processedTypes) throws IllegalArgumentException, IllegalAccessException{
        Rating result = new Rating();     
        
        if (targetObject == null){
            return result;
        }
        
        if (processedTypes.contains(targetObject.getClass())){
            return result;
        }
        
        processedTypes.add(targetObject.getClass());        
        Field[] fields = clazz.getDeclaredFields();
        
        for(Field field : fields)
        {
            try
            {
                field.setAccessible(true);                                                
            }
            catch(Exception e)
            {
                //not accessible
                continue;
            }
            Object value = field.get(targetObject);
            String name = field.getName(); 
            
            JsonProperty jsonProperty = field.getDeclaredAnnotation(JsonProperty.class);
            if (jsonProperty != null)
            {
                name = jsonProperty.value();                
            }                             
            
            result = CalculateRichness(field, targetObject, fields, result, value, name);                       
        }
        
        return result;
    }
    
    private static Rating CalculateRichness(Field field, Object targetObject, Field[] fields, Rating result, Object value, String name) throws IllegalArgumentException, IllegalAccessException
    {
        if (field.isAnnotationPresent(RichnessScore.class))     
        {     
            RichnessScore richness = field.getDeclaredAnnotation(RichnessScore.class); 
            if (richness != null)
            {
                if (richness.dependentField() != null && !"".equals(richness.dependentField()))
                {
                    for(Field f : fields)
                    {
                        if (f.getName().equals(richness.dependentField()) && !field.get(targetObject).toString().equals(richness.dependentValue()))
                        {
                            return result;
                        }
                    }
                }
                result.AddRichnessTotal(richness.value());
                if (value instanceof Collection) {
                    Collection<Object> collection = ((Collection<Object>) value);
                    if (!collection.isEmpty())
                    {
                        result.AddPopulated(name, richness.value());
                        result.AddRichnessScore(richness.value());                        
                    }
                    else
                    {
                        result.AddNonPopulated(name, richness.value());
                    }
                }
                else if (richness.minimumAgeDays() > 0 && field.getType().isAssignableFrom(Date.class))
                {
                    Date dateBefore = new Date(new Date().getTime() - (richness.minimumAgeDays() * 24 * 3600 * 1000l));
                    if (value != null && ((Date)value).after(dateBefore))
                    {                        
                        result.AddPopulated(name, richness.value());
                        result.AddRichnessScore(richness.value());                                                
                    }
                    else
                    {
                        result.AddNonPopulated(name, richness.value());                        
                    }
                }
                else if (value != null && !"".equals(value.toString()))
                {       
                    result.AddPopulated(name, richness.value());
                    result.AddRichnessScore(richness.value());                        
                }
                else
                {
                    result.AddNonPopulated(name, richness.value());
                }
            }                        
        }    
        return result;
    }
}
