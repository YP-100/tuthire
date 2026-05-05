package com.example.tuthire.controller;

import com.example.tuthire.entity.Teacher;
import com.example.tuthire.service.TeacherService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    private final TeacherService service;

    public TeacherController(TeacherService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public Teacher register(@Valid @RequestBody Teacher teacher) {
        return service.register(teacher);
    }

    @PostMapping("/login")
    public Teacher login(@RequestBody Teacher teacher) {
        return service.login(teacher.getEmail(), teacher.getPassword());
    }

    @GetMapping("/search")
    public List<Teacher> searchTeachers(
            @RequestParam String subject,
            @RequestParam String standard) {

        return service.searchTeachers(subject, standard);
    }

    @PutMapping("/updateAmount")
    public Teacher updateAmount(@RequestParam Long id, @RequestParam Double amount) {
        return service.updateAmount(id, amount);
    }

    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable Long id) {
        return service.getTeacherById(id);
    }

   @GetMapping("/all")
public List<Teacher> getAllTeachers() {
    return service.getAllTeachers();
}

@PutMapping("/admin/update")
public Teacher updateTeacher(@RequestBody Teacher teacher) {
    return service.updateTeacher(teacher);
}

@DeleteMapping("/admin/{id}")
public String deleteTeacher(@PathVariable Long id) {
    service.deleteTeacher(id);
    return "Deleted";
}
}