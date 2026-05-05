package com.example.tuthire.service;

import com.example.tuthire.entity.Admin;
import com.example.tuthire.repository.AdminRepository;
import org.springframework.stereotype.Service;


@Service
public class AdminService {

    private final AdminRepository repo;

    public AdminService(AdminRepository repo) {
        this.repo = repo;
    }

    public Admin register(Admin admin) {
        if (repo.findByEmail(admin.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (repo.findByContact(admin.getContact()).isPresent()) {
            throw new RuntimeException("Contact already exists");
        }

        if (repo.findByLoginName(admin.getLoginName()).isPresent()) {
            throw new RuntimeException("Login name already exists");
        }
        return repo.save(admin);
    }

    public Admin login(String email, String password) {

    Admin admin = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

    if (!admin.getPassword().equals(password)) {
        throw new RuntimeException("Invalid admin credentials");
    }

    return admin;
}
}  