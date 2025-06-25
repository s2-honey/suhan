package com.example.milo_be.controller;

import com.example.milo_be.JWT.JwtUtil;
import com.example.milo_be.dto.MonthlyEmotionResponse;
import com.example.milo_be.service.EmotionSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
public class EmotionSummaryController {

    private final EmotionSummaryService emotionSummaryService;
    private final JwtUtil jwtUtil;  // ✅ JWT 유틸 주입

    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlyEmotionResponse> getMonthlySummary(
            @RequestHeader("Authorization") String token,
            @RequestParam String yearMonth) {

        // ✅ JWT 토큰에서 userId 추출
        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);

        MonthlyEmotionResponse response = emotionSummaryService.getMonthlySummary(userId, yearMonth);
        return ResponseEntity.ok(response);
    }
}
