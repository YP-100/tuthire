package com.example.tuthire.service;

import com.example.tuthire.entity.*;
import com.example.tuthire.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final HiringRepository hiringRepo;

    public PaymentService(PaymentRepository paymentRepo,
            HiringRepository hiringRepo) {
        this.paymentRepo = paymentRepo;
        this.hiringRepo = hiringRepo;
    }

    public Payment makePayment(Long hiringId, double amount, String transactionId) {

        if (paymentRepo.existsByTransactionId(transactionId)) {
            throw new RuntimeException("Duplicate transaction");
        }

        @SuppressWarnings("null")
        Hiring hiring = hiringRepo.findById(hiringId)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);

        payment.setStudent(hiring.getStudent());
        payment.setTeacher(hiring.getTeacher());
        payment.setHiring(hiring);

        return paymentRepo.save(payment);
    }

    // STUDENT REQUEST REFUND
    public Payment requestRefund(Long hiringId, String reason) {

        Payment payment = paymentRepo.findByHiringId(hiringId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getRefundStatus() != Payment.RefundStatus.NONE) {
            throw new RuntimeException("Refund already requested");
        }

        payment.setRefundStatus(Payment.RefundStatus.REQUESTED);
        payment.setRefundReason(reason);

        return paymentRepo.save(payment);
    }

    // ADMIN APPROVES REFUND
    public Payment approveRefund(Long hiringId) {

        Payment payment = paymentRepo.findByHiringId(hiringId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getRefundStatus() != Payment.RefundStatus.REQUESTED) {
            throw new RuntimeException("No refund request");
        }

        payment.setRefundStatus(Payment.RefundStatus.APPROVED);

        return paymentRepo.save(payment);
    }

    // ADMIN REJECT REFUND
    public Payment rejectRefund(Long hiringId) {

        Payment payment = paymentRepo.findByHiringId(hiringId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setRefundStatus(Payment.RefundStatus.REJECTED);

        return paymentRepo.save(payment);
    }

    public List<Payment> getStudentPayments(Long studentId) {
        return paymentRepo.findByStudentId(studentId);
    }

    public Payment getByHiring(Long hiringId) {
        return paymentRepo.findByHiringId(hiringId).orElse(null);
    }
}