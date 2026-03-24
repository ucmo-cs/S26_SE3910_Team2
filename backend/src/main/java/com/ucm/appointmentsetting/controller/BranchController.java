package com.ucm.appointmentsetting.controller;

import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchRepository branchRepository;
    private final TopicRepository topicRepository;

    public BranchController(BranchRepository branchRepository, TopicRepository topicRepository) {
        this.branchRepository = branchRepository;
        this.topicRepository = topicRepository;
    }

    @GetMapping
    public List<Branch> getBranchesByTopic(@RequestParam Long topicId) {
        return topicRepository.findById(topicId)
                .map(Topic::getBranches)
                .stream()
                .flatMap(Set::stream)
                .toList();
    }
}
