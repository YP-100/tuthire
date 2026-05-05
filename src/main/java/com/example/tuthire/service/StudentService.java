package com.example.tuthire.service;

import com.example.tuthire.entity.Student;
import com.example.tuthire.repository.StudentRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public Student register(Student student) {

        if (repo.findByEmail(student.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (repo.findByContact(student.getContact()).isPresent()) {
            throw new RuntimeException("Contact already exists");
        }

        if (repo.findByLoginName(student.getLoginName()).isPresent()) {
            throw new RuntimeException("Login name already exists");
        }

        return repo.save(student);
    }

    public Student login(String email, String password) {

        Student student = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid student credentials"));

        if (!student.getPassword().equals(password)) {
            throw new RuntimeException("Invalid student credentials");
        }

        if (!student.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        return student;
    }

    public List<Student> getAllStudents() {
        return repo.findAllActive();
    }

    public Student updateStudent(Student updated) {

        @SuppressWarnings("null")
        Student s = repo.findById(updated.getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        s.setFullName(updated.getFullName());
        s.setEmail(updated.getEmail());
        s.setGender(updated.getGender());
        s.setLoginName(updated.getLoginName());
        s.setContact(updated.getContact());
        s.setAddress(updated.getAddress());

        return repo.save(s);
    }

    @SuppressWarnings("null")
    public void deleteStudent(Long id) {

        Student student = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setActive(false);

        repo.save(student);
    }
}