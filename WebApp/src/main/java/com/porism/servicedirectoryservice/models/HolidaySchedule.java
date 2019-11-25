/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Dominic Skinner
 */
@Entity
@Table(name = "holiday_schedule")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "HolidaySchedule.findAll", query = "SELECT h FROM HolidaySchedule h")
    , @NamedQuery(name = "HolidaySchedule.findById", query = "SELECT h FROM HolidaySchedule h WHERE h.id = :id")
    , @NamedQuery(name = "HolidaySchedule.findByClosed", query = "SELECT h FROM HolidaySchedule h WHERE h.closed = :closed")
    , @NamedQuery(name = "HolidaySchedule.findByOpensAt", query = "SELECT h FROM HolidaySchedule h WHERE h.opensAt = :opensAt")
    , @NamedQuery(name = "HolidaySchedule.findByClosesAt", query = "SELECT h FROM HolidaySchedule h WHERE h.closesAt = :closesAt")
    , @NamedQuery(name = "HolidaySchedule.findByStartDate", query = "SELECT h FROM HolidaySchedule h WHERE h.startDate = :startDate")
    , @NamedQuery(name = "HolidaySchedule.findByEndDate", query = "SELECT h FROM HolidaySchedule h WHERE h.endDate = :endDate")})
public class HolidaySchedule implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "closed")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private boolean closed;
    @Column(name = "opens_at")
    @Temporal(TemporalType.TIME)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonFormat(pattern = "HH:mm")
    @JsonProperty("opens_at")
    private Date opensAt;
    @Column(name = "closes_at")
    @Temporal(TemporalType.TIME)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonFormat(pattern = "HH:mm")
    @JsonProperty("closes_at")
    private Date closesAt;
    @Basic(optional = false)
    @NotNull
    @Column(name = "start_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("start_date")
    private Date startDate;
    @Basic(optional = false)
    @NotNull
    @Column(name = "end_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("end_date")
    private Date endDate;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service")
    private Service serviceId;
    @JoinColumn(name = "service_at_location_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service_at_location")
    private ServiceAtLocation serviceAtLocationId;

    public HolidaySchedule() {
    }

    public HolidaySchedule(String id) {
        this.id = id;
    }

    public HolidaySchedule(String id, boolean closed, Date startDate, Date endDate) {
        this.id = id;
        this.closed = closed;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean getClosed() {
        return closed;
    }

    public void setClosed(boolean closed) {
        this.closed = closed;
    }

    public Date getOpensAt() {
        return opensAt;
    }

    public void setOpensAt(Date opensAt) {
        this.opensAt = opensAt;
    }

    public Date getClosesAt() {
        return closesAt;
    }

    public void setClosesAt(Date closesAt) {
        this.closesAt = closesAt;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    public ServiceAtLocation getServiceAtLocationId() {
        return serviceAtLocationId;
    }

    public void setServiceAtLocationId(ServiceAtLocation serviceAtLocationId) {
        this.serviceAtLocationId = serviceAtLocationId;
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
        if (!(object instanceof HolidaySchedule)) {
            return false;
        }
        HolidaySchedule other = (HolidaySchedule) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.HolidaySchedule[ id=" + id + " ]";
    }
    
}
