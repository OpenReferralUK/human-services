/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
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
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Dominic Skinner
 */
@Entity
@Table(name = "link_taxonomy")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "LinkTaxonomy.findAll", query = "SELECT l FROM LinkTaxonomy l")
    , @NamedQuery(name = "LinkTaxonomy.findById", query = "SELECT l FROM LinkTaxonomy l WHERE l.id = :id")})
public class LinkTaxonomy implements Serializable, ITaxonomy {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    private String id;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "link_type")
    private String linkType;
    @Lob
    @Size(max = 65535)
    @Column(name = "link_id")
    @JsonProperty("link_id")
    private String linkId;
    @JoinColumn(name = "taxonomy_id", referencedColumnName = "id")
    @ManyToOne
    @JsonProperty("taxonomy")
    private Taxonomy taxonomyId;

    public LinkTaxonomy() {
    }

    public LinkTaxonomy(String id) {
        this.id = id;
    }

    public LinkTaxonomy(String id, String linkType) {
        this.id = id;
        this.linkType = linkType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLinkType() {
        return linkType;
    }

    public void setLinkType(String linkType) {
        this.linkType = linkType;
    }

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
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
        if (!(object instanceof LinkTaxonomy)) {
            return false;
        }
        LinkTaxonomy other = (LinkTaxonomy) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.LinkTaxonomy[ id=" + id + " ]";
    }
    
}
