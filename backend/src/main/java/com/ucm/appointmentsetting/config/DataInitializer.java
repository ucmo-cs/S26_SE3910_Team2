package com.ucm.appointmentsetting.config;

import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.BranchSchedule;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.entity.User;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import com.ucm.appointmentsetting.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    @Order(1)
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
    @Order(2)
    CommandLineRunner seedBranches(BranchRepository branchRepository) {
        return args -> {
            Map<String, Branch> branchesByName = branchRepository.findAll()
                    .stream()
                    .collect(Collectors.toMap(Branch::getName, Function.identity()));

            Branch downtown = branchesByName.getOrDefault("Downtown Branch", new Branch());
            populateBranch(downtown, "Downtown Branch", "123 Main St", "Kansas City", "MO", "64105");
            if (downtown.getId() == null || !hasSchedules(downtown.getId())) {
                downtown.setSchedules(List.of(
                        createSchedule(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), downtown),
                        createSchedule(DayOfWeek.TUESDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), downtown),
                        createSchedule(DayOfWeek.WEDNESDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), downtown),
                        createSchedule(DayOfWeek.THURSDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), downtown),
                        createSchedule(DayOfWeek.FRIDAY, LocalTime.of(9, 0), LocalTime.of(17, 0), downtown),
                        createSchedule(DayOfWeek.SATURDAY, LocalTime.of(9, 0), LocalTime.of(12, 0), downtown)
                ));
            }

            Branch south = branchesByName.getOrDefault("South Branch", new Branch());
            populateBranch(south, "South Branch", "456 Oak Ave", "Kansas City", "MO", "64131");
            if (south.getId() == null || !hasSchedules(south.getId())) {
                south.setSchedules(List.of(
                        createSchedule(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), south),
                        createSchedule(DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), south),
                        createSchedule(DayOfWeek.WEDNESDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), south),
                        createSchedule(DayOfWeek.THURSDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), south),
                        createSchedule(DayOfWeek.FRIDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), south),
                        createSchedule(DayOfWeek.SATURDAY, LocalTime.of(9, 0), LocalTime.of(13, 0), south)
                ));
            }

            Branch north = branchesByName.getOrDefault("North Branch", new Branch());
            populateBranch(north, "North Branch", "789 Pine Rd", "Kansas City", "MO", "64155");
            if (north.getId() == null || !hasSchedules(north.getId())) {
                north.setSchedules(List.of(
                        createSchedule(DayOfWeek.MONDAY, LocalTime.of(8, 30), LocalTime.of(16, 30), north),
                        createSchedule(DayOfWeek.TUESDAY, LocalTime.of(8, 30), LocalTime.of(16, 30), north),
                        createSchedule(DayOfWeek.WEDNESDAY, LocalTime.of(8, 30), LocalTime.of(16, 30), north),
                        createSchedule(DayOfWeek.THURSDAY, LocalTime.of(8, 30), LocalTime.of(16, 30), north),
                        createSchedule(DayOfWeek.FRIDAY, LocalTime.of(8, 30), LocalTime.of(16, 30), north),
                        createSchedule(DayOfWeek.SATURDAY, LocalTime.of(9, 0), LocalTime.of(12, 0), north)
                ));
            }

            branchRepository.saveAll(List.of(downtown, south, north));
        };
    }

    private BranchSchedule createSchedule(DayOfWeek dayOfWeek, LocalTime openingTime, LocalTime closingTime, Branch branch) {
        BranchSchedule schedule = new BranchSchedule(dayOfWeek, openingTime, closingTime);
        schedule.setBranch(branch);
        return schedule;
    }

    private void populateBranch(Branch branch, String name, String address, String city, String state, String zip) {
        branch.setName(name);
        branch.setAddress(address);
        branch.setCity(city);
        branch.setState(state);
        branch.setZip(zip);
    }

    private boolean hasSchedules(Long branchId) {
        Long scheduleCount = entityManager.createQuery(
                "select count(s) from BranchSchedule s where s.branch.id = :branchId",
                Long.class
        ).setParameter("branchId", branchId).getSingleResult();
        return scheduleCount != null && scheduleCount > 0;
    }

    @Bean
    @Order(3)
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
            if (downtown != null
                    && loans != null
                    && creditCards != null
                    && entityManager.createQuery(
                            "select count(t) from Branch b join b.topics t where b.id = :branchId",
                            Long.class
                    ).setParameter("branchId", downtown.getId()).getSingleResult() == 0) {
                downtown.setTopics(new HashSet<>(List.of(loans, creditCards)));
                branchRepository.save(downtown);
            }

            Branch south = branchesByName.get("South Branch");
            if (south != null
                    && creditCards != null
                    && newAccounts != null
                    && entityManager.createQuery(
                            "select count(t) from Branch b join b.topics t where b.id = :branchId",
                            Long.class
                    ).setParameter("branchId", south.getId()).getSingleResult() == 0) {
                south.setTopics(new HashSet<>(List.of(creditCards, newAccounts)));
                branchRepository.save(south);
            }

            Branch north = branchesByName.get("North Branch");
            if (north != null
                    && newAccounts != null
                    && fraudSupport != null
                    && entityManager.createQuery(
                            "select count(t) from Branch b join b.topics t where b.id = :branchId",
                            Long.class
                    ).setParameter("branchId", north.getId()).getSingleResult() == 0) {
                north.setTopics(new HashSet<>(List.of(newAccounts, fraudSupport)));
                branchRepository.save(north);
            }
        };
    }

    @Bean
    @Order(4)
    CommandLineRunner seedBankerUser(UserRepository userRepository) {
        return args -> {
            List<User> usersNeedingRoles = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == null || user.getRole().isBlank())
                    .peek(user -> user.setRole("CUSTOMER"))
                    .toList();

            if (!usersNeedingRoles.isEmpty()) {
                userRepository.saveAll(usersNeedingRoles);
            }

            if (userRepository.existsByUsernameIgnoreCase("BestBanker")) {
                User banker = userRepository.findByUsernameIgnoreCase("BestBanker").orElseThrow();
                banker.setFullName("Best Banker");
                banker.setPhoneNumber("8005550100");
                banker.setEmail("bestbanker@commercebank.local");
                banker.setPasswordHash(passwordEncoder.encode("TestPassword1!"));
                banker.setRole("BANKER");
                userRepository.save(banker);
                return;
            }

            User banker = new User();
            banker.setFullName("Best Banker");
            banker.setPhoneNumber("8005550100");
            banker.setEmail("bestbanker@commercebank.local");
            banker.setUsername("BestBanker");
            banker.setPasswordHash(passwordEncoder.encode("TestPassword1!"));
            banker.setRole("BANKER");

            userRepository.save(banker);
        };
    }
}
