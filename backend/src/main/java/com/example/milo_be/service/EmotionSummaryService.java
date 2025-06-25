package com.example.milo_be.service;

import com.example.milo_be.domain.entity.MonthlyEmotionSummary;
import com.example.milo_be.domain.entity.User;
import com.example.milo_be.dto.MonthlyEmotionResponse;
import com.example.milo_be.repository.MonthlyEmotionSummaryRepository;
import com.example.milo_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EmotionSummaryService {

    private final MonthlyEmotionSummaryRepository summaryRepository;
    private final UserRepository userRepository;

    public MonthlyEmotionResponse getMonthlySummary(String userId, String yearMonthStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // LocalDate로 파싱 (yyyy-MM → yyyy-MM-01로)
        LocalDate yearMonth = LocalDate.parse(yearMonthStr + "-01");

        MonthlyEmotionSummary summary = summaryRepository.findByUserAndYearMonths(user, yearMonth)
                .orElseThrow(() -> new NoSuchElementException("요청한 월에 대한 감정 데이터가 없습니다."));

        return MonthlyEmotionResponse.from(summary);
    }
}
