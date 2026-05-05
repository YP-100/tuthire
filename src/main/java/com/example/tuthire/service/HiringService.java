package com.example.tuthire.service;

import com.example.tuthire.entity.*;
import com.example.tuthire.entity.Hiring.Status;
import com.example.tuthire.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HiringService {

    private final HiringRepository hiringRepo;
    private final StudentRepository studentRepo;
    private final TeacherRepository teacherRepo;
    private final AvailabilityRepository availabilityRepo;

    public HiringService(HiringRepository hiringRepo,
            StudentRepository studentRepo,
            TeacherRepository teacherRepo,
            AvailabilityRepository availabilityRepo) {

        this.hiringRepo = hiringRepo;
        this.studentRepo = studentRepo;
        this.teacherRepo = teacherRepo;
        this.availabilityRepo = availabilityRepo;
    }

    // Student sends request
    @SuppressWarnings("null")
    public Hiring sendRequest(Long studentId, Long teacherId, Long availabilityId,
            String subject, String standard) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Availability availability = availabilityRepo.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!availability.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }
        Hiring hiring = new Hiring();
        hiring.setStudent(student);
        hiring.setTeacher(teacher);
        hiring.setAvailability(availability);
        hiring.setSubject(subject.toLowerCase());
        hiring.setStandard(standard);
        hiring.setStatus(Status.PAYMENT_PENDING);
        hiring.setDateRequested(LocalDateTime.now());
        hiring.setAmount(teacher.getAmount());
        hiring.setPaymentDone(false);
        hiring.setApprovedByAdmin(false);

        return hiringRepo.save(hiring);
    }

    // Accept / Reject
    public Hiring updateStatus(Long hiringId, Status status) {

        @SuppressWarnings("null")
        Hiring hiring = hiringRepo.findById(hiringId)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        hiring.setStatus(status);
        hiring.setDateResponded(LocalDateTime.now());

        if (status == Status.ACCEPTED) {
            Availability slot = hiring.getAvailability();
            slot.setAvailable(false);
            availabilityRepo.save(slot);
        }

        if (status == Status.COMPLETED) {
            Availability slot = hiring.getAvailability();
            slot.setAvailable(true);
            availabilityRepo.save(slot);
        }

        return hiringRepo.save(hiring);
    }

    @SuppressWarnings("null")
    public Hiring approve(Long id) {

        Hiring hiring = hiringRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        // Update hiring
        hiring.setPaymentDone(true);
        hiring.setApprovedByAdmin(true);
        hiring.setStatus(Status.PENDING);

        // CHECK if payment already exists
        Payment payment = paymentRepo.findByHiringId(id).orElse(null);

        if (payment == null) {

            // CREATE PAYMENT (VERY IMPORTANT)
            payment = new Payment();
            payment.setAmount(hiring.getAmount());
            payment.setTransactionId("ADMIN_" + id); // dummy txn
            payment.setPaymentDate(java.time.LocalDateTime.now());
            payment.setStatus(Payment.PaymentStatus.SUCCESS);

            payment.setStudent(hiring.getStudent());
            payment.setTeacher(hiring.getTeacher());
            payment.setHiring(hiring);

            paymentRepo.save(payment);

        } else {
            // UPDATE EXISTING PAYMENT
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            paymentRepo.save(payment);
        }

        return hiringRepo.save(hiring);
    }

    // Student view
    public List<Hiring> getStudentRequests(Long studentId) {
        return hiringRepo.findByStudentIdAndStatusIn(
                studentId,
                List.of(Status.PENDING, Status.ACCEPTED, Status.COMPLETED));
    }

    // Teacher view
    public List<Hiring> getTeacherRequests(Long teacherId) {
        return hiringRepo.findByTeacherIdAndStatusIn(
                teacherId,
                List.of(Status.PENDING, Status.ACCEPTED, Status.COMPLETED));
    }

    public List<Hiring> getAll() {
        return hiringRepo.findAll();
    }

    public Hiring updateHiring(Hiring updated) {

        @SuppressWarnings("null")
        Hiring h = hiringRepo.findById(updated.getId())
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        h.setSubject(updated.getSubject());
        h.setStandard(updated.getStandard());
        h.setStatus(updated.getStatus());

        return hiringRepo.save(h);
    }

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private FeedbackRepository feedbackRepo;

    @SuppressWarnings("null")
    public void deleteHiring(Long id) {

        Hiring hiring = hiringRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        // DELETE CHILD RECORDS FIRST
        feedbackRepo.findByHiringId(id).ifPresent(feedbackRepo::delete);
        paymentRepo.findByHiringId(id).ifPresent(paymentRepo::delete);

        hiringRepo.delete(hiring);
    }

}