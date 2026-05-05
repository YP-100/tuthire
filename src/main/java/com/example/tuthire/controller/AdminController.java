package com.example.tuthire.controller;

import com.example.tuthire.entity.Admin;
import com.example.tuthire.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

 
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Admin register(@Valid @RequestBody Admin admin) {
        return service.register(admin);
    }

    @PostMapping("/login")
    public Admin login(@RequestBody Admin admin) {
        return service.login(admin.getEmail(), admin.getPassword());
    }
}