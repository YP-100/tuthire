package com.example.tuthire.repository;

import com.example.tuthire.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByContact(String contact);

    Optional<Student> findByLoginName(String loginName);

    @Query("SELECT s FROM Student s WHERE s.active = true")
    List<Student> findAllActive();

}