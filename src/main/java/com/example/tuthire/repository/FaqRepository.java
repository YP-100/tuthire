package com.example.tuthire.repository;

import com.example.tuthire.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {

    List<Faq> findByQuestionContainingIgnoreCase(String keyword);

    List<Faq> findByCategoryIgnoreCase(String category);

    @Query("SELECT DISTINCT f.category FROM Faq f")
    List<String> findAllCategories();
}