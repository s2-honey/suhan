package com.example.milo_be.service;

import com.example.milo_be.domain.entity.DailyEmotionReport;
import com.example.milo_be.domain.entity.User;
import com.example.milo_be.dto.DayEmotionDto;
import com.example.milo_be.dto.EmotionReportResponseDto;
import com.example.milo_be.repository.EmotionReportRepository;
import com.example.milo_be.repository.UserRepository;
import com.example.milo_be.JWT.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EmotionReportService {

    private final EmotionReportRepository reportRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * [1] 특정 날짜의 감정 리포트 조회
     */
    public EmotionReportResponseDto.DailyReport getDailyReport(String token, LocalDate date) {
        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("유효하지 않은 사용자입니다."));

        DailyEmotionReport report = reportRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> new NoSuchElementException("해당 날짜의 리포트가 존재하지 않습니다."));

        return EmotionReportResponseDto.DailyReport.from(report);
    }

    /**
     * [2] 특정 월에 리포트가 존재하는 날짜 목록(day 숫자) 조회
     */
    public List<Integer> getReportDaysInMonth(String token, int year, int month) {
        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("유효하지 않은 사용자입니다."));

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return reportRepository.findReportDaysByUserAndMonth(user, start, end);
    }

    // src/main/java/com/example/milo_be/service/EmotionReportService.java
    public List<DayEmotionDto> getDayEmotionInMonth(String token, YearMonth ym) {
        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("유효하지 않은 사용자입니다."));

        LocalDate start = ym.atDay(1);           // 해당 달 1일
        LocalDate end   = ym.atEndOfMonth();     // 해당 달 마지막 날

        return reportRepository
                .findDayAndEmotionByUserAndMonth(user, start, end); // 내림차순 이미 적용
    }

}
