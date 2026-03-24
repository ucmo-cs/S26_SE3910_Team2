package com.ucm.appointmentsetting.repository;

import com.ucm.appointmentsetting.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}
