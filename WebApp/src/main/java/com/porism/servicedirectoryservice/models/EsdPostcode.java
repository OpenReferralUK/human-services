/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "esd_postcode")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "EsdPostcode.findAll", query = "SELECT e FROM EsdPostcode e")
    , @NamedQuery(name = "EsdPostcode.findById", query = "SELECT e FROM EsdPostcode e WHERE e.id = :id")
    , @NamedQuery(name = "EsdPostcode.findByCode", query = "SELECT e FROM EsdPostcode e WHERE e.code = :code")
    , @NamedQuery(name = "EsdPostcode.findByLatitude", query = "SELECT e FROM EsdPostcode e WHERE e.latitude = :latitude")
    , @NamedQuery(name = "EsdPostcode.findByLongitude", query = "SELECT e FROM EsdPostcode e WHERE e.longitude = :longitude")})
public class EsdPostcode implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "code")
    private String code;
    @Basic(optional = false)
    @NotNull
    @Column(name = "latitude")
    private double latitude;
    @Basic(optional = false)
    @NotNull
    @Column(name = "longitude")
    private double longitude;

    public EsdPostcode() {
    }

    public EsdPostcode(Integer id) {
        this.id = id;
    }

    public EsdPostcode(Integer id, String code, double latitude, double longitude) {
        this.id = id;
        this.code = code;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
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
        if (!(object instanceof EsdPostcode)) {
            return false;
        }
        EsdPostcode other = (EsdPostcode) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.EsdPostcode[ id=" + id + " ]";
    }
    
}
