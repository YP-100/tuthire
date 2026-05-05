package com.example.tuthire.controller;

import com.example.tuthire.entity.Faq;
import com.example.tuthire.repository.FaqRepository;
import com.example.tuthire.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatbotController {

    private final ChatbotService service;
    private final FaqRepository repo;

    public ChatbotController(ChatbotService service, FaqRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    // ===== CHAT =====
    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {

        String message = request.get("message");

        String reply = service.getResponse(message);

        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);

        return response;
    }

    // ===== ADMIN: ADD FAQ =====
    @SuppressWarnings("null")
    @PostMapping("/faq/add")
    public Faq addFaq(@RequestBody Faq faq) {
        return repo.save(faq);
    }

    // ===== ADMIN: UPDATE FAQ =====
    @PutMapping("/faq/update/{id}")
    public Faq updateFaq(@PathVariable Long id, @RequestBody Faq updated) {

        @SuppressWarnings("null")
        Faq f = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));

        f.setQuestion(updated.getQuestion());
        f.setAnswer(updated.getAnswer());
        f.setCategory(updated.getCategory());

        return repo.save(f);
    }

    // ===== ADMIN: DELETE FAQ =====
    @SuppressWarnings("null")
    @DeleteMapping("/faq/delete/{id}")
    public void deleteFaq(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // ===== ADMIN: GET ALL FAQ =====
    @GetMapping("/faq/all")
    public java.util.List<Faq> getAllFaq() {
        return repo.findAll();
    }

    // ===== GET ALL CATEGORIES =====
    @GetMapping("/categories")
    public java.util.List<String> getCategories() {
        return repo.findAllCategories();
    }

    // ===== GET QUESTIONS BY CATEGORY =====
    @GetMapping("/questions/{category}")
    public java.util.List<Faq> getQuestions(@PathVariable String category) {
        return repo.findByCategoryIgnoreCase(category);
    }
}