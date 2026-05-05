package com.example.tuthire.repository;

import com.example.tuthire.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByTeacherId(Long teacherId);

    List<Availability> findByTeacherIdAndAvailableTrue(Long teacherId);

}