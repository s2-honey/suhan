package com.example.milo_be.repository;

import com.example.milo_be.domain.entity.MonthlyEmotionSummary;
import com.example.milo_be.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface MonthlyEmotionSummaryRepository extends JpaRepository<MonthlyEmotionSummary, Long> {
    Optional<MonthlyEmotionSummary> findByUserAndYearMonths(User user, LocalDate yearMonths);
}
