package com.example.tuthire.service;

import com.example.tuthire.entity.*;
import com.example.tuthire.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepo;
    private final TeacherRepository teacherRepo;
    private final HiringRepository hiringRepo;

    public AvailabilityService(AvailabilityRepository availabilityRepo,
            TeacherRepository teacherRepo,
            HiringRepository hiringRepo) {
        this.availabilityRepo = availabilityRepo;
        this.teacherRepo = teacherRepo;
        this.hiringRepo = hiringRepo;
    }

    // ADD AVAILABILITY
    @SuppressWarnings("null")
    public Availability addAvailability(Long teacherId, Availability availability) {

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        availability.setTeacher(teacher);
        availability.setAvailable(true); // ensure default

        return availabilityRepo.save(availability);
    }

    // GET ALL AVAILABILITY OF TEACHER
    public List<Availability> getAvailability(Long teacherId) {
        return availabilityRepo.findByTeacherIdAndAvailableTrue(teacherId);
    }

    // UPDATE AVAILABILITY (EDIT EXISTING)
    @SuppressWarnings("null")
    public Availability updateAvailability(Long id, Availability updated) {

        Availability existing = availabilityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        // ONLY BLOCK ACTIVE HIRINGS
        if (hiringRepo.existsByAvailabilityIdAndStatusIn(
                id,
                List.of(Hiring.Status.PENDING, Hiring.Status.ACCEPTED))) {
            throw new RuntimeException("Cannot edit slot while it is active");
        }

        existing.setDay(updated.getDay());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setDate(updated.getDate());

        return availabilityRepo.save(existing);
    }

    // DELETE AVAILABILITY
    @SuppressWarnings("null")
    public void deleteAvailability(Long id) {

        Availability existing = availabilityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        // BLOCK if ACTIVE hirings exist
        if (hiringRepo.existsByAvailabilityIdAndStatusIn(
                id,
                List.of(Hiring.Status.PENDING, Hiring.Status.ACCEPTED))) {

            throw new RuntimeException("Slot is active and cannot be deleted");
        }

        // CHECK if ANY hiring exists (including COMPLETED)
        if (hiringRepo.existsByAvailabilityId(id)) {

            // SOFT DELETE (make unavailable instead of deleting)
            existing.setAvailable(false);
            availabilityRepo.save(existing);

        } else {
            // NO FK issue → safe to delete
            availabilityRepo.delete(existing);
        }
    }

    // ADMIN: get ALL (even inactive)
    public List<Availability> getAllAvailabilityForAdmin(Long teacherId) {
        return availabilityRepo.findByTeacherId(teacherId);
    }
}