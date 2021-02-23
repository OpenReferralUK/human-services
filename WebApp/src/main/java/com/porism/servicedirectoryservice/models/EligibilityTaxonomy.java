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
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
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
@Table(name = "eligibility_taxonomy")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "EligibilityTaxonomy.findAll", query = "SELECT t FROM EligibilityTaxonomy t")
    , @NamedQuery(name = "EligibilityTaxonomy.findById", query = "SELECT t FROM EligibilityTaxonomy t WHERE t.id = :id")})
public class EligibilityTaxonomy implements Serializable {

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
    @Column(name = "name")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "vocabulary")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String vocabulary;
    @Column(name = "link_id")
    private String linkId;
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    @ManyToOne
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    @JsonProperty("parent")  
    private Taxonomy parentId;        

    public EligibilityTaxonomy() {
    }

    public EligibilityTaxonomy(String id) {
        this.id = id;
    }

    public EligibilityTaxonomy(String id, String name) {
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

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof EligibilityTaxonomy)) {
            return false;
        }
        EligibilityTaxonomy other = (EligibilityTaxonomy) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return id;
    }
    
}
