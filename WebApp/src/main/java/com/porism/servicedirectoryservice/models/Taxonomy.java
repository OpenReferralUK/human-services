/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
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
@Table(name = "taxonomy")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Taxonomy.findAll", query = "SELECT t FROM Taxonomy t")
    , @NamedQuery(name = "Taxonomy.findById", query = "SELECT t FROM Taxonomy t WHERE t.id = :id")})
public class Taxonomy implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(BasicView.class)
    private String id;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "name")
    @JsonView(BasicView.class)
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "vocabulary")
    @JsonView(BasicView.class)
    private String vocabulary;
    @OneToMany(mappedBy = "taxonomyId")
    private Collection<LinkTaxonomy> linkTaxonomyCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "taxonomyId")
    private Collection<ServiceTaxonomy> serviceTaxonomyCollection;

    public Taxonomy() {
    }

    public Taxonomy(String id) {
        this.id = id;
    }

    public Taxonomy(String id, String name) {
        this.id = id;
        this.name = name;
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

    public String getVocabulary() {
        return vocabulary;
    }

    public void setVocabulary(String vocabulary) {
        this.vocabulary = vocabulary;
    }

    @XmlTransient
    public Collection<LinkTaxonomy> getLinkTaxonomyCollection() {
        return linkTaxonomyCollection;
    }

    public void setLinkTaxonomyCollection(Collection<LinkTaxonomy> linkTaxonomyCollection) {
        this.linkTaxonomyCollection = linkTaxonomyCollection;
    }

    @XmlTransient
    public Collection<ServiceTaxonomy> getServiceTaxonomyCollection() {
        return serviceTaxonomyCollection;
    }

    public void setServiceTaxonomyCollection(Collection<ServiceTaxonomy> serviceTaxonomyCollection) {
        this.serviceTaxonomyCollection = serviceTaxonomyCollection;
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
        if (!(object instanceof Taxonomy)) {
            return false;
        }
        Taxonomy other = (Taxonomy) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.Taxonomy[ id=" + id + " ]";
    }
    
}
