/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.BasicView;
import com.porism.servicedirectoryservice.views.ReviewView;
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
@Table(name = "review")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Review.findAll", query = "SELECT r FROM Review r")
    , @NamedQuery(name = "Review.findById", query = "SELECT r FROM Review r WHERE r.id = :id")
    , @NamedQuery(name = "Review.findByTitle", query = "SELECT r FROM Review r WHERE r.title = :title")
    , @NamedQuery(name = "Review.findByDate", query = "SELECT r FROM Review r WHERE r.date = :date")})
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 1536)
    @Column(name = "id")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String id;
    @Lob
    @Size(max = 65535)    
    @Column(name = "title")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String title;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String description;
    @Column(name = "date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private Date date;
    @Lob
    @Size(max = 65535)
    @Column(name = "score")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String score;
    @Lob
    @Size(max = 65535)
    @Column(name = "url")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String url;
    @Lob
    @Size(max = 65535)
    @Column(name = "widget")
    @JsonView(value = {BasicView.class, SelectedServiceView.class})
    private String widget;
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    @ManyToOne
    @JsonView(ReviewView.class)
    @JsonProperty("service")
    private Service serviceId;
    @JoinColumn(name = "reviewer_organization_id", referencedColumnName = "id")
    @ManyToOne
    @JsonView(BasicView.class)
    @JsonProperty("organization")
    private Organization reviewerOrganizationId;

    public Review() {
    }

    public Review(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getWidget() {
        return widget;
    }

    public void setWidget(String widget) {
        this.widget = widget;
    }

    public Service getServiceId() {
        return serviceId;
    }

    public void setServiceId(Service serviceId) {
        this.serviceId = serviceId;
    }

    public Organization getReviewerOrganizationId() {
        return reviewerOrganizationId;
    }

    public void setReviewerOrganizationId(Organization reviewerOrganizationId) {
        this.reviewerOrganizationId = reviewerOrganizationId;
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
        if (!(object instanceof Review)) {
            return false;
        }
        Review other = (Review) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.Review[ id=" + id + " ]";
    }
    
}
