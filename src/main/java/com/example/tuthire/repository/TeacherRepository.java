package com.example.tuthire.repository;

import com.example.tuthire.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByContact(String contact);

    Optional<Teacher> findByLoginName(String loginName);

    // find teacher by subject and standard
    @Query("SELECT t FROM Teacher t WHERE t.active = true AND " +
       "LOWER(t.subjects) LIKE LOWER(CONCAT('%', :subject, '%')) " +
       "AND t.standards LIKE CONCAT('%', :standard, '%')")
    List<Teacher> searchTeachers(String subject, String standard);

    @Query("SELECT t FROM Teacher t WHERE t.active = true")
    List<Teacher> findAllActive();
}