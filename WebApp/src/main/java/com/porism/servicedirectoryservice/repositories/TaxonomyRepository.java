/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Taxonomy;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface TaxonomyRepository extends CrudRepository<Taxonomy, String> {
    public List<Taxonomy> findByVocabularyOrderByIdAsc(String vocabulary);
    @Query("SELECT DISTINCT t.vocabulary FROM Taxonomy t ORDER BY t.vocabulary ASC")
    public List<String> findDistinctVocabulary();
}
