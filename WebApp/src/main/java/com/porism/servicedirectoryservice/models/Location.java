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
import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
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
@Table(name = "location")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Location.findAll", query = "SELECT l FROM Location l")
    , @NamedQuery(name = "Location.findById", query = "SELECT l FROM Location l WHERE l.id = :id")
    , @NamedQuery(name = "Location.findByLatitude", query = "SELECT l FROM Location l WHERE l.latitude = :latitude")
    , @NamedQuery(name = "Location.findByLongitude", query = "SELECT l FROM Location l WHERE l.longitude = :longitude")})
public class Location implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(BasicView.class)
    private String id;
    @Lob
    @Size(max = 65535)
    @Column(name = "name")
    @JsonView(BasicView.class)
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    @JsonView(BasicView.class)
    private String description;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "latitude")
    @JsonView(BasicView.class)
    private Double latitude;
    @Column(name = "longitude")
    @JsonView(BasicView.class)
    private Double longitude;
    @OneToMany(mappedBy = "locationId")
    @JsonView(BasicView.class)
    @JsonProperty("physical_addresses")
    private Collection<PhysicalAddress> physicalAddressCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "locationId")
    @JsonView(LocationView.class)
    @JsonProperty("service_at_locations")
    private Collection<ServiceAtLocation> serviceAtLocationCollection;
    @OneToMany(mappedBy = "locationId")
    @JsonView(LocationView.class)
    @JsonProperty("accessibility_for_disabilities")
    private Collection<AccessibilityForDisabilities> accessibilityForDisabilitiesCollection;

    public Location() {
    }

    public Location(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @XmlTransient
    public Collection<PhysicalAddress> getPhysicalAddressCollection() {
        return physicalAddressCollection;
    }

    public void setPhysicalAddressCollection(Collection<PhysicalAddress> physicalAddressCollection) {
        this.physicalAddressCollection = physicalAddressCollection;
    }

    @XmlTransient
    public Collection<ServiceAtLocation> getServiceAtLocationCollection() {
        return serviceAtLocationCollection;
    }

    public void setServiceAtLocationCollection(Collection<ServiceAtLocation> serviceAtLocationCollection) {
        this.serviceAtLocationCollection = serviceAtLocationCollection;
    }

    @XmlTransient
    public Collection<AccessibilityForDisabilities> getAccessibilityForDisabilitiesCollection() {
        return accessibilityForDisabilitiesCollection;
    }

    public void setAccessibilityForDisabilitiesCollection(Collection<AccessibilityForDisabilities> accessibilityForDisabilitiesCollection) {
        this.accessibilityForDisabilitiesCollection = accessibilityForDisabilitiesCollection;
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
        if (!(object instanceof Location)) {
            return false;
        }
        Location other = (Location) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.Location[ id=" + id + " ]";
    }
    
}
