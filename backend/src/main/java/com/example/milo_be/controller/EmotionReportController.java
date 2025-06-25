package com.example.milo_be.controller;

import com.example.milo_be.dto.DayEmotionDto;
import com.example.milo_be.dto.EmotionReportResponseDto;
import com.example.milo_be.service.EmotionReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/report")
public class EmotionReportController {

    private final EmotionReportService reportService;

    /**
     * [GET] 하루 감정 리포트 조회
     */
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyReport(
            @RequestHeader("Authorization") String token,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            String jwt = token.replace("Bearer", "").trim();
            EmotionReportResponseDto.DailyReport response = reportService.getDailyReport(jwt, date);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * [GET] 특정 월에 감정 리포트가 존재하는 날짜(day) 목록 조회
     * @param token Authorization 헤더
     * @param month YYYY-MM 형식 (예: 2025-06)
     */
    @GetMapping("/days")
    public ResponseEntity<?> getReportDaysByMonth(
            @RequestHeader("Authorization") String token,
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        try {
            String jwt = token.replace("Bearer", "").trim();
            List<Integer> reportDays = reportService.getReportDaysInMonth(jwt, month.getYear(), month.getMonthValue());
            return ResponseEntity.ok(reportDays);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("월간 리포트 조회 중 서버 오류가 발생했습니다.");
        }
    }

    // src/main/java/com/example/milo_be/controller/EmotionReportController.java
    /**
     * [GET] 특정 월의 날짜 + 대표 감정 목록 조회
     *  ex) /api/report/records?month=2025-06
     */
    @GetMapping("/records")
    public ResponseEntity<?> getDayEmotionRecords(
            @RequestHeader("Authorization") String token,
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        try {
            String jwt = token.replace("Bearer", "").trim();
            List<DayEmotionDto> list = reportService.getDayEmotionInMonth(jwt, month);
            return ResponseEntity.ok(list);          // 200 OK, JSON 배열
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("월간 기록 조회 중 오류가 발생했습니다.");
        }
    }

}
