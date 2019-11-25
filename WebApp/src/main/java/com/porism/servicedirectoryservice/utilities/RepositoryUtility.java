/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.utilities;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public class RepositoryUtility {
    public static String emptyToNull(String value)
    {
        if ("".equals(value))
        {
            return null;
        }
        return value;
    }
    
    public static List<String> emptyToNull(List<String> value)
    {
        if (value == null)
        {
            List<String> vals = new ArrayList<String>();
            vals.add("NULL_LIST_HACK");
            return vals;            
        }
        if (value.isEmpty())
        {
            List<String> vals = new ArrayList<String>();
            vals.add("EMPTY_LIST_HACK");
            return vals;
        }
        return value;
    }    
}
