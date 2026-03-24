package com.ucm.appointmentsetting.config;

import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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

    @Bean
    CommandLineRunner seedBranchTopics(TopicRepository topicRepository, BranchRepository branchRepository) {
        return args -> {
            if (topicRepository.count() == 0 || branchRepository.count() == 0) {
                return;
            }

            Map<String, Topic> topicsByName = topicRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(Topic::getName, Function.identity()));

            Map<String, Branch> branchesByName = branchRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(Branch::getName, Function.identity()));

            Topic loans = topicsByName.get("Loans");
            Topic creditCards = topicsByName.get("Credit Cards");
            Topic newAccounts = topicsByName.get("New Accounts");
            Topic fraudSupport = topicsByName.get("Fraud Support");

            Branch downtown = branchesByName.get("Downtown Branch");
            if (downtown != null && loans != null && creditCards != null) {
                downtown.setTopics(new HashSet<>(List.of(loans, creditCards)));
                branchRepository.save(downtown);
            }

            Branch south = branchesByName.get("South Branch");
            if (south != null && creditCards != null && newAccounts != null) {
                south.setTopics(new HashSet<>(List.of(creditCards, newAccounts)));
                branchRepository.save(south);
            }

            Branch north = branchesByName.get("North Branch");
            if (north != null && newAccounts != null && fraudSupport != null) {
                north.setTopics(new HashSet<>(List.of(newAccounts, fraudSupport)));
                branchRepository.save(north);
            }
        };
    }
}
