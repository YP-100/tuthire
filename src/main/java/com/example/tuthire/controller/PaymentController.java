package com.example.tuthire.controller;

import com.example.tuthire.entity.Payment;
import com.example.tuthire.service.PaymentService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/pay")
    public Payment makePayment(
            @RequestParam Long hiringId,
            @RequestParam double amount,
            @RequestParam String transactionId) {

        return service.makePayment(hiringId, amount, transactionId);
    }

    // STUDENT REQUEST REFUND
    @PutMapping("/refund/request")
    public Payment requestRefund(
            @RequestParam Long hiringId,
            @RequestParam String reason) {

        return service.requestRefund(hiringId, reason);
    }

    // ADMIN APPROVE REFUND
    @PutMapping("/refund/approve")
    public Payment approveRefund(@RequestParam Long hiringId) {
        return service.approveRefund(hiringId);
    }

    // ADMIN REJECT REFUND
    @PutMapping("/refund/reject")
    public Payment rejectRefund(@RequestParam Long hiringId) {
        return service.rejectRefund(hiringId);
    }

    @GetMapping("/student/{id}")
    public List<Payment> getStudentPayments(@PathVariable Long id) {
        return service.getStudentPayments(id);
    }

    @GetMapping("/byHiring/{id}")
    public ResponseEntity<Payment> getByHiring(@PathVariable Long id) {

        Payment payment = service.getByHiring(id);

        if (payment == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(payment);
    }

}