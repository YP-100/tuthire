package com.example.tuthire.repository;

import com.example.tuthire.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByHiringId(Long hiringId);

    boolean existsByTransactionId(String transactionId);

    void deleteByHiringId(Long hiringId);

    List<Payment> findByStudentId(Long studentId);
}