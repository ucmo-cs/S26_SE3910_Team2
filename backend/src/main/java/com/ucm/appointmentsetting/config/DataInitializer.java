package com.ucm.appointmentsetting.config;

import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedTopics(TopicRepository topicRepository) {
        return args -> {
            if (topicRepository.count() > 0) {
                return;
            }

            Topic loans = new Topic();
            loans.setName("Loans");
            loans.setDescription("Support for personal, auto, and home loan questions.");

            Topic creditCards = new Topic();
            creditCards.setName("Credit Cards");
            creditCards.setDescription("Help with applications, limits, payments, and card services.");

            Topic newAccounts = new Topic();
            newAccounts.setName("New Accounts");
            newAccounts.setDescription("Assistance with opening checking, savings, and related accounts.");

            Topic fraudSupport = new Topic();
            fraudSupport.setName("Fraud Support");
            fraudSupport.setDescription("Guidance for suspicious transactions, blocked cards, and account security.");

            topicRepository.saveAll(List.of(loans, creditCards, newAccounts, fraudSupport));
        };
    }
}
