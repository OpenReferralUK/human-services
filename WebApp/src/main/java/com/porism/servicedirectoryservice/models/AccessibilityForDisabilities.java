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
@Table(name = "accessibility_for_disabilities")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "AccessibilityForDisabilities.findAll", query = "SELECT a FROM AccessibilityForDisabilities a")
    , @NamedQuery(name = "AccessibilityForDisabilities.findById", query = "SELECT a FROM AccessibilityForDisabilities a WHERE a.id = :id")})
public class AccessibilityForDisabilities implements Serializable {

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
    @Column(name = "accessibility")
    @JsonView(BasicView.class)
    @AllowedValues(value={"cd", "deaf_interpreter","disabled_parking","elevator","ramp","restroom","tape_braille","tty","wheelchair","wheelchair_van"})
    private String accessibility;
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("location")
    private Location locationId;

    public AccessibilityForDisabilities() {
    }

    public AccessibilityForDisabilities(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccessibility() {
        return accessibility;
    }

    public void setAccessibility(String accessibility) {
        this.accessibility = accessibility;
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
        if (!(object instanceof AccessibilityForDisabilities)) {
            return false;
        }
        AccessibilityForDisabilities other = (AccessibilityForDisabilities) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.AccessibilityForDisabilities[ id=" + id + " ]";
    }
    
}
