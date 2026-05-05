package com.example.tuthire.entity;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false)
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank
    @Pattern(regexp = "^[MFTmft]$", message = "Gender must be M, F, or T")
    private String gender;

    @NotBlank(message = "Login name is required")
    @Column(nullable = false, unique = true)
    private String loginName;

    @NotBlank(message = "Contact is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact must be 10 digits")
    @Column(nullable = false, unique = true)
    private String contact;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "Subjects required")
    @Column(nullable = false)
    private String subjects;

    @NotBlank(message = "Standards required")
    @Column(nullable = false)
    private String standards;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Availability> availabilityList;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private boolean active = true;
}