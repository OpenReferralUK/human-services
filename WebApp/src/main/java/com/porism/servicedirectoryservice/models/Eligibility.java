/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.validation.AllowedValues;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Dominic Skinner
 */
@Entity
@Table(name = "eligibility")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Eligibility.findAll", query = "SELECT e FROM Eligibility e")
    , @NamedQuery(name = "Eligibility.findById", query = "SELECT e FROM Eligibility e WHERE e.id = :id")})
public class Eligibility implements Serializable, ITaxonomy {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String id;
    @Lob
    @Size(max = 65535)
    @Column(name = "eligibility")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @AllowedValues(value={"adult", "child", "teen", "family", "female", "male", "Transgender", "Transgender - M to F", "Transgender - F to M"})
    private String eligibility;
    @JsonProperty("minimum_age")
    @Column(name = "minimum_age")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private Float minimumAge;    
    @JsonProperty("maximum_age")
    @Column(name = "maximum_age")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private Float maximumAge; 
    @JoinColumn(name = "link_id", referencedColumnName = "id")
    @JsonProperty("taxonomys")
    @OneToMany(fetch=FetchType.EAGER)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})    
    private Collection<EligibilityTaxonomy> taxonomys;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service")
    private Service serviceId;

    public Eligibility() {
    }

    public Eligibility(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
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
        if (!(object instanceof Eligibility)) {
            return false;
        }
        Eligibility other = (Eligibility) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.Eligibility[ id=" + id + " ]";
    }

    @Override
    public String getLinkId() {
        return this.serviceId.getId();
    }
    
}
