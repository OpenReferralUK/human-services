/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.LocationView;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import com.porism.servicedirectoryservice.views.ServiceView;
import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Dominic Skinner
 */
@Entity
@Table(name = "service_at_location")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ServiceAtLocation.findAll", query = "SELECT s FROM ServiceAtLocation s")
    , @NamedQuery(name = "ServiceAtLocation.findById", query = "SELECT s FROM ServiceAtLocation s WHERE s.id = :id")})
public class ServiceAtLocation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    private String id;
    @OneToMany(mappedBy = "serviceAtLocationId")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("regular_schedule")
    private Collection<RegularSchedule> regularScheduleCollection;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonView(LocationView.class)
    @JsonProperty("service")
    private Service serviceId;
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonView(value = {ServiceView.class, SelectedServiceView.class})
    @JsonProperty("location")    
    private Location locationId;
    @OneToMany(mappedBy = "serviceAtLocationId")
    private Collection<HolidaySchedule> holidayScheduleCollection;

    public ServiceAtLocation() {
    }

    public ServiceAtLocation(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @XmlTransient
    public Collection<RegularSchedule> getRegularScheduleCollection() {
        return regularScheduleCollection;
    }

    public void setRegularScheduleCollection(Collection<RegularSchedule> regularScheduleCollection) {
        this.regularScheduleCollection = regularScheduleCollection;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    public Location getLocationId() {
        return locationId;
    }

    public void setLocationId(Location locationId) {
        this.locationId = locationId;
    }

    @XmlTransient
    public Collection<HolidaySchedule> getHolidayScheduleCollection() {
        return holidayScheduleCollection;
    }

    public void setHolidayScheduleCollection(Collection<HolidaySchedule> holidayScheduleCollection) {
        this.holidayScheduleCollection = holidayScheduleCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ServiceAtLocation)) {
            return false;
        }
        ServiceAtLocation other = (ServiceAtLocation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.ServiceAtLocation[ id=" + id + " ]";
    }
    
}
