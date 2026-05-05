package com.example.tuthire.controller;

import com.example.tuthire.entity.*;
import com.example.tuthire.entity.Hiring.Status;
import com.example.tuthire.service.HiringService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hiring")
public class HiringController {

    private final HiringService service;

    public HiringController(HiringService service) {
        this.service = service;
    }

    // Send request
    @PostMapping("/request")
    public Hiring sendRequest(
            @RequestParam Long studentId,
            @RequestParam Long teacherId,
            @RequestParam Long availabilityId,
            @RequestParam String subject,
            @RequestParam String standard) {

        return service.sendRequest(studentId, teacherId, availabilityId, subject, standard);
    }

    // Accept / Reject
    @PutMapping("/status")
    public Hiring updateStatus(
            @RequestParam Long hiringId,
            @RequestParam Status status) {

        return service.updateStatus(hiringId, status);
    }

    // Student requests
    @GetMapping("/student/{id}")
    public List<Hiring> getStudentRequests(@PathVariable Long id) {
        return service.getStudentRequests(id);
    }

    // Teacher requests
    @GetMapping("/teacher/{id}")
    public List<Hiring> getTeacherRequests(@PathVariable Long id) {
        return service.getTeacherRequests(id);
    }

    // updating status
    @PutMapping("/updateStatus")
    public Hiring updateStatus(
            @RequestParam Long hiringId,
            @RequestParam String status) {

        return service.updateStatus(
                hiringId,
                Hiring.Status.valueOf(status.toUpperCase()));
    }

    // payment
    @PutMapping("/approve")
    public Hiring approve(
            @RequestParam Long id,
            @RequestParam String role) {

        if (!role.equalsIgnoreCase("admin")) {
            throw new RuntimeException("Only admin can approve");
        }

        return service.approve(id);
    }

@GetMapping("/all")
public List<Hiring> getAll() {
    return service.getAll();
}

@PutMapping("/admin/update")
public Hiring updateHiring(@RequestBody Hiring hiring) {
    return service.updateHiring(hiring);
}

@DeleteMapping("/admin/{id}")
public String deleteHiring(@PathVariable Long id) {
    service.deleteHiring(id);
    return "Deleted";
}
}