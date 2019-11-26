/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.validation;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.porism.servicedirectoryservice.services.ITaxonomyService;
import java.util.Arrays;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

/**
 *
 * @author Dominic Skinner
 */
public class ValidationUtility {
    private static final Set<Class<?>> BASIC_TYPES = getBasicTypes();
    

    public static boolean isBasicType(Class<?> clazz)
    {
        return BASIC_TYPES.contains(clazz);
    }

    private static Set<Class<?>> getBasicTypes()
    {
        Set<Class<?>> ret = new HashSet<Class<?>>();
        ret.add(Boolean.class);
        ret.add(Character.class);
        ret.add(Byte.class);
        ret.add(Short.class);
        ret.add(Integer.class);
        ret.add(Long.class);
        ret.add(Float.class);
        ret.add(Double.class);
        ret.add(String.class);
        return ret;
    }    
    
    public static ValidationResult[] Validate(Object targetObject, ITaxonomyService taxonomyService, String parentName) throws IllegalArgumentException, IllegalAccessException{
        return Validate(targetObject, taxonomyService, parentName, false);    
    }
    
    public static ValidationResult[] Validate(Object targetObject, ITaxonomyService taxonomyService, String parentName, boolean ignoreNullId) throws IllegalArgumentException, IllegalAccessException{
        if (targetObject == null){
            List<ValidationResult> results = new ArrayList<ValidationResult>();
            results.add(new ValidationResult("No such " + parentName + " exists."));
            return results.toArray(new ValidationResult[results.size()]);
        }        
        
        List<ValidationResult> results = Validate(targetObject, targetObject.getClass(), taxonomyService, parentName, new HashSet<Class<?>>(), null, ignoreNullId);
        return results.toArray(new ValidationResult[results.size()]);
    }     
    
    private static List<ValidationResult> Validate(Object targetObject, Class<?> clazz, ITaxonomyService taxonomyService, String parentName, HashSet<Class<?>> processedTypes, Object[] childObjects, boolean ignoreNullId) throws IllegalArgumentException, IllegalAccessException{
        List<ValidationResult> result = new ArrayList<ValidationResult>();     
        
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
            
            boolean found = false;
            
            if (field.getType().isPrimitive() || isBasicType(field.getType()))
            {
                if (field.isAnnotationPresent(NotNull.class) && !(ignoreNullId && field.isAnnotationPresent(Id.class)))
                {
                    if (value == null || "".equals(value.toString()))
                    {
                        result.add(new ValidationResult("A null or empty value has been assigned to the required field '" + parentName + "." + name + "'"));
                    }
                    found = true;
                }                 
            }   
            
            if (field.isAnnotationPresent(AllowedValues.class))     
            {
                if (value != null && !"".equals(value.toString()))
                {
                    AllowedValues allowedValues = field.getDeclaredAnnotation(AllowedValues.class);                        

                    if (allowedValues != null)
                    {
                        List<String> values = Arrays.asList(allowedValues.value());
                        if (!values.contains(value.toString()))
                        {
                            result.add(new ValidationResult(String.format("The value '%s' is not one of the allowed values for this field '%s'. The allowed values are: '%s'", value.toString(), parentName + "." + name, String.join("', '", values))));
                        }
                    }
                }
                found = true;
            }            
            
            if (found)
            {
                continue;
            }            
            
            if (field.isAnnotationPresent(RequriedScheme.class))     
            {                
                if (value != null && !"".equals(value.toString()))
                {                                
                    RequriedScheme requriedScheme = field.getDeclaredAnnotation(RequriedScheme.class);                        

                    if (requriedScheme != null && childObjects != null)
                    {
                        List<String> colVals = new ArrayList<String>();
                        for(Object childObject : childObjects)
                        {
                            if (childObject != null)
                            {
                                colVals.add(childObject.toString());                            
                            }
                        }
                        if (taxonomyService.countByVocabularyAndTerms(requriedScheme.value(), colVals) == 0)
                        {
                            String fieldName = parentName + "." + name;
                            result.add(new ValidationResult(String.format("The field '%s' must have at least one term from '%s'", fieldName, requriedScheme.value())));
                        }
                    }
                }                
            }                
            
            if (value instanceof Collection) {
                Collection<Object> collection = ((Collection<Object>) value);
                for (Object o : collection) {
                    result.addAll(Validate(o, o.getClass(), taxonomyService, parentName + "." + name, processedTypes, collection.toArray(new Object[collection.size()]), ignoreNullId));
                }
                continue;
            }
            result.addAll(Validate(value, field.getType(), taxonomyService, parentName + "." + name, processedTypes, null, ignoreNullId));
        }
        
        return result;
    }
}
