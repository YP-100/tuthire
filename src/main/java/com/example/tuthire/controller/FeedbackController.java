package com.example.tuthire.controller;

import com.example.tuthire.entity.Feedback;
import com.example.tuthire.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    // Add feedback
    @PostMapping("/add")
    public Feedback addFeedback(
            @RequestParam Long hiringId,
            @RequestParam int rating,
            @RequestParam String review) {

        return service.addFeedback(hiringId, rating, review);
    }

    // Get teacher feedback
    @GetMapping("/teacher/{id}")
    public List<Feedback> getFeedback(@PathVariable Long id) {
        return service.getTeacherFeedback(id);
    }

    @PutMapping("/update")
    public Feedback updateFeedback(
            @RequestParam Long hiringId,
            @RequestParam int rating,
            @RequestParam String review) {

        return service.updateFeedback(hiringId, rating, review);
    }

    @PutMapping("/reply")
    public Feedback reply(
            @RequestParam Long hiringId,
            @RequestParam String reply) {

        return service.replyToFeedback(hiringId, reply);
    }

    @DeleteMapping("/{id}")
public String deleteFeedback(@PathVariable Long id) {
    service.deleteFeedback(id);
    return "Feedback deleted";
}

@GetMapping("/all")
public List<Feedback> getAll() {
    return service.getAll();
}

@PutMapping("/admin/update")
public Feedback adminUpdate(@RequestBody Feedback feedback) {
    return service.adminUpdate(feedback);
}
    
}