package com.example.tuthire.repository;

import com.example.tuthire.entity.Admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByContact(String contact);

    Optional<Admin> findByLoginName(String loginName);
} 