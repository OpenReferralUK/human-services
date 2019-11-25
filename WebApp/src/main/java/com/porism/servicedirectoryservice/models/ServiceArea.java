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
@Table(name = "service_area")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ServiceArea.findAll", query = "SELECT s FROM ServiceArea s")
    , @NamedQuery(name = "ServiceArea.findById", query = "SELECT s FROM ServiceArea s WHERE s.id = :id")})
public class ServiceArea implements Serializable, ITaxonomy {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    private String id;
    @Lob
    @Size(max = 65535)
    @Column(name = "service_area")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("service_area")      
    private String serviceArea;
    @Lob
    @Size(max = 65535)
    @Column(name = "extent")
    public String extent;    
    @Lob
    @Size(max = 65535)
    @Column(name = "uri")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    public String uri;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    private Service serviceId;

    public ServiceArea() {
    }

    public ServiceArea(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
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
        if (!(object instanceof ServiceArea)) {
            return false;
        }
        ServiceArea other = (ServiceArea) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.ServiceArea[ id=" + id + " ]";
    }

    /**
     * @return the extent
     */
    public String getExtent() {
        return extent;
    }

    /**
     * @return the uri
     */
    public String getUri() {
        return uri;
    }

    @Override
    public String getLinkId() {
        return this.serviceId.getId();
    }
    
}
