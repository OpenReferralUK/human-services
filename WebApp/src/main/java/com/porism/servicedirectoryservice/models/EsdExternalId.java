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
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Administrator
 */
@Entity
@Table(name = "esd_external_id")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "EsdExternalId.findAll", query = "SELECT e FROM EsdExternalId e")
    , @NamedQuery(name = "EsdExternalId.findByUuid", query = "SELECT e FROM EsdExternalId e WHERE e.uuid = :uuid")
    , @NamedQuery(name = "EsdExternalId.findByExternalId", query = "SELECT e FROM EsdExternalId e WHERE e.externalId = :externalId")})
public class EsdExternalId implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1586)
    @Column(name = "uuid")
    private String uuid;
    @Size(max = 1586)
    @Column(name = "external_id")
    private String externalId;
    @Lob
    @Size(max = 65535)
    @Column(name = "origin")
    private String origin;
    @Lob
    @Size(max = 65535)
    @Column(name = "reference_table")
    private String referenceTable;

    public EsdExternalId() {
    }

    public EsdExternalId(String uuid) {
        this.uuid = uuid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getReferenceTable() {
        return referenceTable;
    }

    public void setReferenceTable(String referenceTable) {
        this.referenceTable = referenceTable;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (uuid != null ? uuid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof EsdExternalId)) {
            return false;
        }
        EsdExternalId other = (EsdExternalId) object;
        if ((this.uuid == null && other.uuid != null) || (this.uuid != null && !this.uuid.equals(other.uuid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.EsdExternalId[ uuid=" + uuid + " ]";
    }
    
}
