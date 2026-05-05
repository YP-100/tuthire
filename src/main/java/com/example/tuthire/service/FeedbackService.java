package com.example.tuthire.service;

import com.example.tuthire.entity.*;
import com.example.tuthire.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final HiringRepository hiringRepo;

    public FeedbackService(FeedbackRepository feedbackRepo,
            HiringRepository hiringRepo) {
        this.feedbackRepo = feedbackRepo;
        this.hiringRepo = hiringRepo;
    }

    // Add feedback
    @SuppressWarnings("null")
    public Feedback addFeedback(Long hiringId, int rating, String review) {

        Hiring hiring = hiringRepo.findById(hiringId)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        if (hiring.getStatus() != Hiring.Status.COMPLETED) {
            throw new RuntimeException("Cannot give feedback for non-accepted hiring");
        }

        // Prevent duplicate feedback
        if (feedbackRepo.existsByHiringId(hiringId)) {
            throw new RuntimeException("Feedback already given for this hiring");
        }

        Feedback feedback = new Feedback();
        feedback.setRating(rating);
        feedback.setReview(review);
        feedback.setStudent(hiring.getStudent());
        feedback.setTeacher(hiring.getTeacher());
        feedback.setHiring(hiring);

        return feedbackRepo.save(feedback);
    }

    // Get teacher feedback
    public List<Feedback> getTeacherFeedback(Long teacherId) {
        return feedbackRepo.findByTeacherId(teacherId);
    }

    // update feedback
    public Feedback updateFeedback(Long hiringId, int rating, String review) {

        @SuppressWarnings("null")
        Hiring hiring = hiringRepo.findById(hiringId)
                .orElseThrow(() -> new RuntimeException("Hiring not found"));

        // Only accepted hiring
        if (hiring.getStatus() != Hiring.Status.COMPLETED) {
            throw new RuntimeException("Cannot edit feedback for non-accepted hiring");
        }

        // Find existing feedback
        Feedback feedback = feedbackRepo.findByHiringId(hiringId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // CHECK BEFORE UPDATE
        if (feedback.getReview().equals(review) && feedback.getRating() == rating) {
            throw new RuntimeException("No changes detected");
        }

        // THEN UPDATE
        feedback.setRating(rating);
        feedback.setReview(review);

        return feedbackRepo.save(feedback);

    }

    // reply to feedbacks
    public Feedback replyToFeedback(Long hiringId, String reply) {

        Feedback feedback = feedbackRepo.findByHiringId(hiringId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setReply(reply);

        return feedbackRepo.save(feedback);
    }

    @SuppressWarnings("null")
    public void deleteFeedback(Long id) {
        feedbackRepo.deleteById(id);
    }

    @SuppressWarnings("null")
    public Feedback adminUpdate(Feedback updated) {

    Feedback f = feedbackRepo.findById(updated.getId())
            .orElseThrow(() -> new RuntimeException("Feedback not found"));

    f.setRating(updated.getRating());
    f.setReview(updated.getReview());
    f.setReply(updated.getReply());

    return feedbackRepo.save(f);
}

    public List<Feedback> getAll() {
    return feedbackRepo.findAll();
}
}