package com.example.tuthire.controller;

import com.example.tuthire.entity.Student;
import com.example.tuthire.service.StudentService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Student register(@Valid @RequestBody Student student) {
        return service.register(student);
    }

    @PostMapping("/login")
    public Student login(@RequestBody Student student) {
        return service.login(student.getEmail(), student.getPassword());
    }

    @GetMapping("/all")
public List<Student> getAllStudents() {
    return service.getAllStudents();
}

@PutMapping("/admin/update")
public Student updateStudent(@RequestBody Student s) {
    return service.updateStudent(s);
}

@DeleteMapping("/admin/{id}")
public String deleteStudent(@PathVariable Long id) {
    service.deleteStudent(id);
    return "Deleted";
}
} 