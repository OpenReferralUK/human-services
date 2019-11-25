package com.porism.servicedirectoryservice.utilities;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.opendevl.JFlat;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.data.domain.Page;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Dominic Skinner
 */
public class ResponseUtility {
    public static <T> T HandleResponse(HttpServletRequest request, HttpServletResponse response, T result, Class<?> clazzType) throws IllegalArgumentException, IOException, Exception {
        if (isCSV(request))
        {
            convertToCSV(response, clazzType, result);
            return null;
        }
        
        return result;
    }           
    
    public static <T> T[] HandleResponse(HttpServletRequest request, HttpServletResponse response, T[] results, Class<?> clazzType) throws IllegalArgumentException, IOException, Exception {
        if (isCSV(request))
        {
            convertToCSV(response, clazzType, results);
            return null;
        }
        
        return results;
    }           
    
    public static <T> Page<T> HandleResponse(HttpServletRequest request, HttpServletResponse response, Page<T> results, Class<?> clazzType) throws IllegalArgumentException, IOException, Exception {
        if (isCSV(request))
        {
            convertToCSV(response, clazzType, results.getContent());
            return null;
        }
        
        return results;
    } 
    
    public static <T> Page<T> HandleResponse(HttpServletRequest request, HttpServletResponse response, String json) throws IllegalArgumentException, IOException, Exception {
        if (json == null)
        {
            return null;
        }
        
        if (isCSV(request))
        {
            convertToCSV(response, json);
            return null;
        }
        
        response.setContentType("application/json");
        try (OutputStream outputStream = response.getOutputStream()) {
            outputStream.write(json.getBytes());           
            outputStream.flush();
        } 
            
        return null;
    }     

    public static boolean isCSV(HttpServletRequest request) {
        return request.getRequestURI().contains(".csv");
    }
    
    private static <T> void convertToCSV(HttpServletResponse response, Class<?> clazzType, Object results) throws IllegalArgumentException, JsonProcessingException, IOException, Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(MapperFeature.DEFAULT_VIEW_INCLUSION);
        mapper.setConfig(mapper.getSerializationConfig().withView(clazzType));
        JsonNode json = mapper.convertValue(results, JsonNode.class);  
        
        convertToCSV(response, mapper.writeValueAsString(json));
    }

    private static <T> void convertToCSV(HttpServletResponse response, String json) throws IllegalArgumentException, JsonProcessingException, IOException, Exception {                       
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=result.csv");
        
        JFlat flatMe = new JFlat(json);
        
        StringBuilder csv = new StringBuilder();
        List<Object[]> matrix = flatMe.json2Sheet().headerSeparator(".").getJsonAsSheet();
        boolean firstRow = true;
        
        for(Object[] row : matrix){
            boolean start = true;
            for(Object col : row)
            {
                if (!start)
                {
                    csv.append(",");                                        
                }
                start = false;
                if (firstRow)
                {
                    csv.append("\"");
                    csv.append(col.toString());
                    csv.append("\"");
                }
                else
                {
                    if (col == null)
                    {
                        csv.append("\"\"");
                        continue;
                    }
                    csv.append(StringEscapeUtils.unescapeHtml4(col.toString()));
                }
            }
            csv.append("\n");
            firstRow = false;
        }
        
        try (OutputStream outputStream = response.getOutputStream()) {
            outputStream.write(csv.toString().getBytes());           
            outputStream.flush();
        }                
    }
}
