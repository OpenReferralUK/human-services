/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.utilities;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import org.springframework.data.domain.Page;

/**
 *
 * @author Dominic Skinner
 */
public class ServiceSerializer extends StdSerializer<Page<Service>> {
    private HashSet<String> allowedFields = new HashSet<String>();
    private boolean pageable = true;
    
    public ServiceSerializer() {
        this(null);
    }
    
    public ServiceSerializer(JavaType t) {
        super(t);
        this.initialize();        
    }    
    
    public void setAllowedFields(HashSet<String> fields)
    {
        this.allowedFields.addAll(fields);
    }
    
    public void setPagable(boolean pageable)
    {
        this.pageable = pageable;
    }
    
    private void initialize(){
        this.allowedFields.add("id");
        this.allowedFields.add("name");
        this.allowedFields.add("description");
        this.allowedFields.add("url");
        this.allowedFields.add("email");
        this.allowedFields.add("status");
        this.allowedFields.add("fees");
        this.allowedFields.add("accreditations");
        this.allowedFields.add("deliverable_type");
        this.allowedFields.add("attending_type");
        this.allowedFields.add("attending_access");
        this.allowedFields.add("assured_date");
        this.allowedFields.add("organization");
    }
    
    @Override
    public void serialize(
      Page<Service> value, JsonGenerator jgen, SerializerProvider provider) 
      throws IOException, JsonProcessingException {                               
        if (pageable)
        {
            jgen.writeStartObject();
            serializePagable(jgen, value);        
            jgen.writeArrayFieldStart("content");
        }
        else
        {
            jgen.writeStartArray();
        }
        
        for(Service service: value.getContent())
        {
            serializeService(jgen, service, provider);           
        }
        
        jgen.writeEndArray();        
        
        if (pageable)
        {
            jgen.writeEndObject();
        }
    }

    private void serializePagable(JsonGenerator jgen, Page<Service> value) throws IOException {
        jgen.writeNumberField("totalElements", value.getTotalElements());
        jgen.writeNumberField("totalPages", value.getTotalPages());
        jgen.writeNumberField("number", value.getNumber());
        jgen.writeNumberField("size", value.getNumberOfElements());
        jgen.writeBooleanField("first", value.isFirst());
        jgen.writeBooleanField("last", value.isLast());
    }

    private void serializeService(JsonGenerator jgen, Service service, SerializerProvider provider) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, false);
        mapper.setConfig(mapper.getSerializationConfig().withView(SelectedServiceView.class));

        jgen.writeStartObject();
        
        writeStringField(jgen, "id", service.getId());
        writeStringField(jgen, "name", service.getName());
        writeStringField(jgen, "description", service.getDescription());
        writeStringField(jgen, "url", service.getUrl());
        writeStringField(jgen, "email", service.getEmail());
        writeStringField(jgen, "status", service.getStatus());
        writeStringField(jgen, "fees", service.getFees());
        writeStringField(jgen, "accreditations", service.getAccreditations());
        writeStringField(jgen, "deliverable_type", service.getDeliverableType());
        writeStringField(jgen, "attending_type", service.getAttendingType());
        writeStringField(jgen, "attending_access", service.getAttendingAccess());

        if (allowedFields.contains("assured_date"))
        {
            if (service.getAssuredDate() != null)
            {
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                jgen.writeStringField("assured_date", dateFormat.format(service.getAssuredDate()));
            }
            else
            {
                jgen.writeStringField("assured_date", null);   
            }
        }
        
        writeObjectField(jgen, mapper, "service_areas", service.getServiceAreaCollection());
        writeObjectField(jgen, mapper, "fundings", service.getFundingCollection());
        writeObjectField(jgen, mapper, "regular_schedules", service.getRegularScheduleCollection());
        writeObjectField(jgen, mapper, "eligibilitys", service.getEligibilityCollection());
        writeObjectField(jgen, mapper, "service_at_locations", service.getServiceAtLocationCollection());
        writeObjectField(jgen, mapper, "cost_options", service.getCostOptionCollection());
        writeObjectField(jgen, mapper, "reviews", service.getReviewCollection());
        writeObjectField(jgen, mapper, "organization", service.getOrganizationId());
        writeObjectField(jgen, mapper, "contacts", service.getContactCollection());
        writeObjectField(jgen, mapper, "holiday_schedules", service.getHolidayScheduleCollection());
        writeObjectField(jgen, mapper, "service_taxonomys", service.getServiceTaxonomyCollection());
        writeObjectField(jgen, mapper, "languages", service.getLanguageCollection());
        
        jgen.writeEndObject();
    }

    private void writeStringField(JsonGenerator jgen, String fieldName, String value) throws IOException {
        if (allowedFields.contains(fieldName))
        {
            jgen.writeStringField(fieldName, value);
        }
    }

    private void writeObjectField(JsonGenerator jgen, ObjectMapper mapper, String fieldName, Object data) throws IOException {
        if (allowedFields.contains(fieldName))
        {
            jgen.writeFieldName(fieldName);
            mapper.writeValue(jgen, data);
        }
    }    
}
