package com.example.tuthire.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hiring {
    public enum Status {
        PAYMENT_PENDING,
        PENDING,
        ACCEPTED,
        REJECTED,
        COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    private String subject;
    private String standard;

    private LocalDateTime dateRequested;
    private LocalDateTime dateResponded;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "availability_id")
    private Availability availability;

    private Double amount;

    private Boolean paymentDone = false;
    private Boolean approvedByAdmin = false;
}