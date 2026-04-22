package com.ucm.appointmentsetting.repository;

import com.ucm.appointmentsetting.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    Optional<User> findByUsernameIgnoreCase(String username);
}
