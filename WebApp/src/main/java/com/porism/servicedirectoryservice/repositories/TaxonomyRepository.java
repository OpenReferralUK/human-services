/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.porism.servicedirectoryservice.repositories;

import com.porism.servicedirectoryservice.models.Service;
import com.porism.servicedirectoryservice.models.Taxonomy;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Dominic Skinner
 */
@Repository
public interface TaxonomyRepository extends PagingAndSortingRepository<Taxonomy, String> {
    @Query(value = "SELECT * FROM taxonomy WHERE (?4 = false OR taxonomy.parent_id IS NULL) AND ('EMPTY_LIST_HACK' IN ?3 OR taxonomy.id IN ?3) AND (?2 IS NULL OR taxonomy.parent_id = ?2) AND (?1 IS NULL OR taxonomy.vocabulary = ?1) ORDER BY id ASC",
        nativeQuery = true)    
    public Page<Taxonomy> findByVocabularyAndParentId(String vocabulary, String parent_id, List<String> taxonomy_ids, boolean root_only, Pageable pageable);
    @Query(value = "SELECT *, MATCH(taxonomy.name) AGAINST(?1) AS name_score FROM taxonomy WHERE ('EMPTY_LIST_HACK' IN ?4 OR taxonomy.id IN ?4) AND (?3 IS NULL OR taxonomy.parent_id = ?3) AND (?2 IS NULL OR taxonomy.vocabulary = ?2) AND MATCH(taxonomy.name) AGAINST(?1 IN BOOLEAN MODE) ORDER BY name_score DESC",
        countQuery = "SELECT COUNT(taxonomy.id) FROM taxonomy WHERE (?5 = false OR taxonomy.parent_id IS NULL) AND (?3 IS NULL OR taxonomy.parent_id = ?3) AND (?2 IS NULL OR taxonomy.vocabulary = ?2) AND MATCH(taxonomy.name) AGAINST(?1 IN BOOLEAN MODE)",
        nativeQuery = true)    
    public Page<Taxonomy> findByTextSearch(String searchText, String vocabulary, String parent_id, List<String> taxonomy_ids, boolean root_only, Pageable pageable);       
    @Query("SELECT DISTINCT t.vocabulary FROM Taxonomy t ORDER BY t.vocabulary ASC")
    public List<String> findDistinctVocabulary();
    @Query(value = "SELECT COUNT(id) FROM taxonomy WHERE vocabulary IN ?1 AND id IN ?2",    
    nativeQuery = true)    
    public int countByVocabularyAndTerms(List<String> vocabulary, List<String> terms);     
    @Query(value = "SELECT `esd_link`.`taxonomy_id` FROM `esd_link` WHERE `esd_link`.`need_id` IN ?1",    
    nativeQuery = true)    
    public List<String> findIdsByNeed(List<String> needs);
    @Query(value = "SELECT `esd_link`.`taxonomy_id` FROM `esd_link` WHERE `esd_link`.`circumstance_id` IN ?1",    
    nativeQuery = true)    
    public List<String> findIdsByCircumstance(List<String> circumstances);    
}
