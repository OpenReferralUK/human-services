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
@Table(name = "cost_option")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "CostOption.findAll", query = "SELECT c FROM CostOption c")
    , @NamedQuery(name = "CostOption.findById", query = "SELECT c FROM CostOption c WHERE c.id = :id")
    , @NamedQuery(name = "CostOption.findByValidFrom", query = "SELECT c FROM CostOption c WHERE c.validFrom = :validFrom")
    , @NamedQuery(name = "CostOption.findByValidTo", query = "SELECT c FROM CostOption c WHERE c.validTo = :validTo")})
public class CostOption implements Serializable, ITaxonomy {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String id;
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
    @Column(name = "`option`")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String option;
    @Column(name = "amount")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private Float amount;
    @Lob
    @Size(max = 65535)    
    @Column(name = "amount_description")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String amount_description;    
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("service")
    private Service serviceId;

    public CostOption() {
    }

    public CostOption(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
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
        if (!(object instanceof CostOption)) {
            return false;
        }
        CostOption other = (CostOption) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.CostOption[ id=" + id + " ]";
    }

    @Override
    public String getLinkId() {
        return this.serviceId.getId();
    }
    
}
