package com.ucm.appointmentsetting.config;

import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.BranchRepository;
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

    @Bean
    CommandLineRunner seedBranches(BranchRepository branchRepository) {
        return args -> {
            if (branchRepository.count() > 0) {
                return;
            }

            Branch downtown = new Branch();
            downtown.setName("Downtown Branch");
            downtown.setAddress("123 Main St");
            downtown.setCity("Kansas City");
            downtown.setState("MO");
            downtown.setZip("64105");

            Branch south = new Branch();
            south.setName("South Branch");
            south.setAddress("456 Oak Ave");
            south.setCity("Kansas City");
            south.setState("MO");
            south.setZip("64131");

            Branch north = new Branch();
            north.setName("North Branch");
            north.setAddress("789 Pine Rd");
            north.setCity("Kansas City");
            north.setState("MO");
            north.setZip("64155");

            branchRepository.saveAll(List.of(downtown, south, north));
        };
    }
}
