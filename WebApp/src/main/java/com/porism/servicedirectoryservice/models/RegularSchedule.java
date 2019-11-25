/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.validation.AllowedValues;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
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
@Table(name = "regular_schedule")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "RegularSchedule.findAll", query = "SELECT r FROM RegularSchedule r")
    , @NamedQuery(name = "RegularSchedule.findById", query = "SELECT r FROM RegularSchedule r WHERE r.id = :id")
    , @NamedQuery(name = "RegularSchedule.findByOpensAt", query = "SELECT r FROM RegularSchedule r WHERE r.opensAt = :opensAt")
    , @NamedQuery(name = "RegularSchedule.findByClosesAt", query = "SELECT r FROM RegularSchedule r WHERE r.closesAt = :closesAt")
    , @NamedQuery(name = "RegularSchedule.findByValidFrom", query = "SELECT r FROM RegularSchedule r WHERE r.validFrom = :validFrom")
    , @NamedQuery(name = "RegularSchedule.findByValidTo", query = "SELECT r FROM RegularSchedule r WHERE r.validTo = :validTo")})
public class RegularSchedule implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String id;
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
    @Column(name = "valid_from")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("valid_from")
    private Date validFrom;
    @Column(name = "valid_to")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("valid_to")
    private Date validTo;
    @Lob
    @Size(max = 65535)
    @Column(name = "dtstart")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String dtstart;
    @Lob
    @Size(max = 65535)
    @Column(name = "freq")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @AllowedValues(value={"WEEKLY", "MONTHLY"})
    private String freq;
    @Lob
    @Size(max = 65535)
    @Column(name = "`interval`")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String interval;
    @Lob
    @Size(max = 65535)
    @Column(name = "byday")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String byday;
    @Lob
    @Size(max = 65535)
    @Column(name = "bymonthday")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String bymonthday;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String description;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service")
    private Service serviceId;
    @JoinColumn(name = "service_at_location_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service_at_location")
    private ServiceAtLocation serviceAtLocationId;

    public RegularSchedule() {
    }

    public RegularSchedule(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Date getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Date validFrom) {
        this.validFrom = validFrom;
    }

    public Date getValidTo() {
        return validTo;
    }

    public void setValidTo(Date validTo) {
        this.validTo = validTo;
    }

    public String getDtstart() {
        return dtstart;
    }

    public void setDtstart(String dtstart) {
        this.dtstart = dtstart;
    }

    public String getFreq() {
        return freq;
    }

    public void setFreq(String freq) {
        this.freq = freq;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }

    public String getByday() {
        return byday;
    }

    public void setByday(String byday) {
        this.byday = byday;
    }

    public String getBymonthday() {
        return bymonthday;
    }

    public void setBymonthday(String bymonthday) {
        this.bymonthday = bymonthday;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        if (!(object instanceof RegularSchedule)) {
            return false;
        }
        RegularSchedule other = (RegularSchedule) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.RegularSchedule[ id=" + id + " ]";
    }
    
}
