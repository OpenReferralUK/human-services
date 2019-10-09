/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.ServiceView;
import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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
@Table(name = "service_taxonomy")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ServiceTaxonomy.findAll", query = "SELECT s FROM ServiceTaxonomy s")
    , @NamedQuery(name = "ServiceTaxonomy.findById", query = "SELECT s FROM ServiceTaxonomy s WHERE s.id = :id")})
public class ServiceTaxonomy implements Serializable, ITaxonomy {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(BasicView.class)
    private String id;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonProperty("service")
    private Service serviceId;
    @JoinColumn(name = "taxonomy_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonView(ServiceView.class)
    @JsonProperty("taxonomy")    
    private Taxonomy taxonomyId;

    public ServiceTaxonomy() {
    }

    public ServiceTaxonomy(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    public Taxonomy getTaxonomyId() {
        return taxonomyId;
    }

    public void setTaxonomyId(Taxonomy taxonomyId) {
        this.taxonomyId = taxonomyId;
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
        if (!(object instanceof ServiceTaxonomy)) {
            return false;
        }
        ServiceTaxonomy other = (ServiceTaxonomy) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.ServiceTaxonomy[ id=" + id + " ]";
    }

    @Override
    public String getLinkId() {
        if (this.getServiceId() == null)
        {
            return "";
        }
        return this.getServiceId().getId();
    }    
}
