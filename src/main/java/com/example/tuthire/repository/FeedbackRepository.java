package com.example.tuthire.repository;

import com.example.tuthire.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByTeacherId(Long teacherId);

    boolean existsByHiringId(Long hiringId);

    Optional<Feedback> findByHiringId(Long hiringId);
}