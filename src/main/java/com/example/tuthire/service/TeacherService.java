package com.example.tuthire.service;

import com.example.tuthire.entity.Teacher;
import com.example.tuthire.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    private final TeacherRepository repo;

    public TeacherService(TeacherRepository repo) {
        this.repo = repo;
    }

    public Teacher register(Teacher teacher) {
        if (repo.findByEmail(teacher.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (repo.findByContact(teacher.getContact()).isPresent()) {
            throw new RuntimeException("Contact already exists");
        }

        if (repo.findByLoginName(teacher.getLoginName()).isPresent()) {
            throw new RuntimeException("Login name already exists");
        }

        teacher.setSubjects(
                teacher.getSubjects() == null || teacher.getSubjects().isBlank()
                        ? ""
                        : Arrays.stream(teacher.getSubjects().split(","))
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .filter(s -> !s.isEmpty())
                                .distinct()
                                .collect(Collectors.joining(",")));

        teacher.setStandards(
                teacher.getStandards() == null || teacher.getStandards().isBlank()
                        ? ""
                        : Arrays.stream(teacher.getStandards().split(","))
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .filter(s -> !s.isEmpty())
                                .distinct()
                                .collect(Collectors.joining(",")));

        return repo.save(teacher);
    }

    public Teacher login(String email, String password) {

        Teacher teacher = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid teacher credentials"));

        if (!teacher.getPassword().equals(password)) {
            throw new RuntimeException("Invalid teacher credentials");
        }

        if (!teacher.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        return teacher;
    }

    // get subjects
    public List<String> getSubjectsList(String subjects) {
        return Arrays.stream(subjects.split(","))
                .map(String::trim)
                .toList();
    }

    // get standards
    public List<String> getStandardsList(String standards) {
        return Arrays.stream(standards.split(","))
                .map(String::trim)
                .toList();
    }

    // search teaccher by subject and standard
    public List<Teacher> searchTeachers(String subject, String standard) {
        return repo.searchTeachers(subject.toLowerCase(), standard);
    }

    public Teacher updateAmount(Long id, Double amount) {

        @SuppressWarnings("null")
        Teacher teacher = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setAmount(amount);

        return repo.save(teacher);
    }

    public Teacher updateTeacher(Teacher updated) {

        @SuppressWarnings("null")
        Teacher t = repo.findById(updated.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // UPDATE ALL FIELDS
        t.setFullName(updated.getFullName());
        t.setEmail(updated.getEmail());
        t.setGender(updated.getGender());
        t.setLoginName(updated.getLoginName());
        t.setContact(updated.getContact());
        t.setAddress(updated.getAddress());
        t.setSubjects(updated.getSubjects());
        t.setStandards(updated.getStandards());
        t.setAmount(updated.getAmount());

        return repo.save(t);
    }

    public List<Teacher> getAllTeachers() {
        return repo.findAllActive();
    }

    @SuppressWarnings("null")
    public void deleteTeacher(Long id) {

        Teacher teacher = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setActive(false);

        repo.save(teacher);
    }

    @SuppressWarnings("null")
    public Teacher getTeacherById(Long id) {

        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }
}