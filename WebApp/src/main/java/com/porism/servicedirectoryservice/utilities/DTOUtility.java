/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.utilities;

import com.porism.servicedirectoryservice.models.ITaxonomy;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Dominic Skinner
 */
public class DTOUtility {
    public static List<String> getIds(List<? extends ITaxonomy> taxonomies){
        List<String> ids = new ArrayList<String>();
        if (taxonomies != null)
        {
            for(ITaxonomy t : taxonomies)
            {
                ids.add(t.getLinkId());
            }
        }
        return ids;
    } 
}
