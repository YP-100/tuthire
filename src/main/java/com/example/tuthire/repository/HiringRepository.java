package com.example.tuthire.repository;

import com.example.tuthire.entity.Hiring;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HiringRepository extends JpaRepository<Hiring, Long> {

    List<Hiring> findByStudentId(Long studentId);

    List<Hiring> findByTeacherId(Long teacherId);

    List<Hiring> findByAvailabilityId(Long availabilityId);

    List<Hiring> findByTeacherIdAndStatusIn(Long teacherId, List<Hiring.Status> statuses);

    List<Hiring> findByStudentIdAndStatusIn(Long studentId, List<Hiring.Status> statuses);

    boolean existsByAvailabilityId(Long availabilityId);

    boolean existsByAvailabilityIdAndStatusIn(Long availabilityId, List<Hiring.Status> statuses);}