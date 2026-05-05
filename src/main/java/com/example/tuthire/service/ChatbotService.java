package com.example.tuthire.service;

import com.example.tuthire.entity.Faq;
import com.example.tuthire.repository.FaqRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatbotService {

    private final FaqRepository repo;

    public ChatbotService(FaqRepository repo) {
        this.repo = repo;
    }

    public String getResponse(String message) {

        List<Faq> list = repo.findByQuestionContainingIgnoreCase(message);
        if (!list.isEmpty()) return list.get(0).getAnswer();

        return "Sorry, I could not understand your question.";
    }
}