package com.example.tuthire.controller;

import com.example.tuthire.entity.Availability;
import com.example.tuthire.service.AvailabilityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {

    private final AvailabilityService service;

    public AvailabilityController(AvailabilityService service) {
        this.service = service;
    }

    // ADD
    @PostMapping("/add")
    public Availability addAvailability(
            @RequestParam Long teacherId,
            @RequestBody Availability availability) {

        return service.addAvailability(teacherId, availability);
    }

    // GET
    @GetMapping("/{teacherId}")
    public List<Availability> getAvailability(@PathVariable Long teacherId) {
        return service.getAvailability(teacherId);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public void deleteAvailability(@PathVariable Long id) {
        service.deleteAvailability(id);
    }

    @PutMapping("/update/{id}")
    public Availability updateAvailability(
            @PathVariable Long id,
            @RequestBody Availability availability) {

        return service.updateAvailability(id, availability);
    }

    // ================= ADMIN =================

// GET ALL availability of a teacher (INCLUDING inactive)
@GetMapping("/admin/{teacherId}")
public List<Availability> getAllAvailabilityForAdmin(@PathVariable Long teacherId) {
    return service.getAllAvailabilityForAdmin(teacherId);
}

// UPDATE (Admin)
@PutMapping("/admin/update/{id}")
public Availability updateAvailabilityAdmin(
        @PathVariable Long id,
        @RequestBody Availability availability) {

    return service.updateAvailability(id, availability);
}

// DELETE (Admin)
@DeleteMapping("/admin/delete/{id}")
public void deleteAvailabilityAdmin(@PathVariable Long id) {
    service.deleteAvailability(id);
}
}