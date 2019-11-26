/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.SelectedServiceView;
import java.io.Serializable;
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
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Dominic Skinner
 */
@Entity
@Table(name = "physical_address")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "PhysicalAddress.findAll", query = "SELECT p FROM PhysicalAddress p")
    , @NamedQuery(name = "PhysicalAddress.findById", query = "SELECT p FROM PhysicalAddress p WHERE p.id = :id")})
public class PhysicalAddress implements Serializable {

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
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "address_1")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("address_1")
    private String address1;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "city")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String city;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "state_province")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("state_province")
    private String stateProvince;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "postal_code")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("postal_code")
    private String postalCode;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "country")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String country;   
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("location")
    private Location locationId;

    public PhysicalAddress() {
    }

    public PhysicalAddress(String id) {
        this.id = id;
    }

    public PhysicalAddress(String id, String address1, String city, String stateProvince, String postalCode, String country) {
        this.id = id;
        this.address1 = address1;
        this.city = city;
        this.stateProvince = stateProvince;
        this.postalCode = postalCode;
        this.country = country;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return stateProvince;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Location getLocationId() {
        return locationId;
    }

    public void setLocationId(Location locationId) {
        this.locationId = locationId;
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
        if (!(object instanceof PhysicalAddress)) {
            return false;
        }
        PhysicalAddress other = (PhysicalAddress) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.PhysicalAddress[ id=" + id + " ]";
    }
    
}
