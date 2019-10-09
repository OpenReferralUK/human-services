/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.porism.servicedirectoryservice.views.ServiceView;
import com.porism.servicedirectoryservice.views.BasicView;
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
@Table(name = "service")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Service.findAll", query = "SELECT s FROM Service s")
    , @NamedQuery(name = "Service.findById", query = "SELECT s FROM Service s WHERE s.id = :id")})
public class Service implements Serializable {

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
    @Column(name = "description")
    @JsonView(BasicView.class)
    private String description;
    @Lob()
    @Size(max = 65535)
    @Column(name = "url")
    @JsonView(BasicView.class)
    private String url;
    // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Lob
    @Size(max = 65535)
    @Column(name = "email")
    @JsonView(BasicView.class)
    private String email;
    @Basic(optional = false)
    @NotNull()
    @Lob()
    @Size(min = 1, max = 65535)
    @Column(name = "status")
    @JsonView(BasicView.class)
    private String status;
    // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Lob
    @Size(max = 65535)
    @Column(name = "fees")
    @JsonView(BasicView.class)
    private String fees;
    @Lob()
    @Size(max = 65535)
    @Column(name = "accreditations")
    @JsonView(BasicView.class)
    private String accreditations;
    @Lob
    @Size(max = 65535)
    @Column(name = "deliverable_type")
    @JsonView(BasicView.class)
    private String deliverableType;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("service_areas")    
    private Collection<ServiceArea> serviceAreaCollection;
    private static final long serialVersionUID = 1L;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("fundings")
    private Collection<Funding> fundingCollection;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("regular_schedules")
    private Collection<RegularSchedule> regularScheduleCollection;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("eligibilitys")
    private Collection<Eligibility> eligibilityCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("service_at_locations")
    private Collection<ServiceAtLocation> serviceAtLocationCollection;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("cost_options")
    private Collection<CostOption> costOptionCollection;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("reviews")
    private Collection<Review> reviewCollection;
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonView(ServiceView.class)
    @JsonProperty("organization")
    private Organization organizationId;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("contacts")
    private Collection<Contact> contactCollection;
    @OneToMany(mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("holiday_schedules")
    private Collection<HolidaySchedule> holidayScheduleCollection;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "serviceId")
    @JsonView(ServiceView.class)
    @JsonProperty("service_taxonomys")
    private Collection<ServiceTaxonomy> serviceTaxonomyCollection;
    @JsonView(ServiceView.class)
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "serviceId")
    @JsonProperty("languages")
    private Collection<Language> languageCollection;    

    public Service() {
    }

    public Service(String id) {
        this.id = id;
    }

    public Service(String id, String name, String status) {
        this.id = id;
        this.name = name;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getDeliverableType() {
        return deliverableType;
    }

    public void setDeliverableType(String deliverableType) {
        this.deliverableType = deliverableType;
    }

    @XmlTransient
    public Collection<Funding> getFundingCollection() {
        return fundingCollection;
    }

    public void setFundingCollection(Collection<Funding> fundingCollection) {
        this.fundingCollection = fundingCollection;
    }

    @XmlTransient
    public Collection<RegularSchedule> getRegularScheduleCollection() {
        return regularScheduleCollection;
    }

    public void setRegularScheduleCollection(Collection<RegularSchedule> regularScheduleCollection) {
        this.regularScheduleCollection = regularScheduleCollection;
    }

    @XmlTransient
    public Collection<Eligibility> getEligibilityCollection() {
        return eligibilityCollection;
    }

    public void setEligibilityCollection(Collection<Eligibility> eligibilityCollection) {
        this.eligibilityCollection = eligibilityCollection;
    }

    @XmlTransient
    public Collection<ServiceAtLocation> getServiceAtLocationCollection() {
        return serviceAtLocationCollection;
    }

    public void setServiceAtLocationCollection(Collection<ServiceAtLocation> serviceAtLocationCollection) {
        this.serviceAtLocationCollection = serviceAtLocationCollection;
    }

    @XmlTransient
    public Collection<CostOption> getCostOptionCollection() {
        return costOptionCollection;
    }

    public void setCostOptionCollection(Collection<CostOption> costOptionCollection) {
        this.costOptionCollection = costOptionCollection;
    }

    @XmlTransient
    public Collection<Review> getReviewCollection() {
        return reviewCollection;
    }

    public void setReviewCollection(Collection<Review> reviewCollection) {
        this.reviewCollection = reviewCollection;
    }

    public Organization getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Organization organizationId) {
        this.organizationId = organizationId;
    }

    @XmlTransient
    public Collection<Contact> getContactCollection() {
        return contactCollection;
    }

    public void setContactCollection(Collection<Contact> contactCollection) {
        this.contactCollection = contactCollection;
    }

    @XmlTransient
    public Collection<HolidaySchedule> getHolidayScheduleCollection() {
        return holidayScheduleCollection;
    }

    public void setHolidayScheduleCollection(Collection<HolidaySchedule> holidayScheduleCollection) {
        this.holidayScheduleCollection = holidayScheduleCollection;
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
        if (!(object instanceof Service)) {
            return false;
        }
        Service other = (Service) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.porism.servicedirectoryservice.models.Service[ id=" + id + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFees() {
        return fees;
    }

    public void setFees(String fees) {
        this.fees = fees;
    }

    public String getAccreditations() {
        return accreditations;
    }

    public void setAccreditations(String accreditations) {
        this.accreditations = accreditations;
    }

    @XmlTransient
    public Collection<ServiceArea> getServiceAreaCollection() {
        return serviceAreaCollection;
    }

    public void setServiceAreaCollection(Collection<ServiceArea> serviceAreaCollection) {
        this.serviceAreaCollection = serviceAreaCollection;
    }

    /**
     * @return the languageCollection
     */
    public Collection<Language> getLanguageCollection() {
        return languageCollection;
    }
    
}
