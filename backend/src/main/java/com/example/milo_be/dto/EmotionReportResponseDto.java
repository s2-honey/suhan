package com.example.milo_be.dto;

import com.example.milo_be.domain.entity.DailyEmotionReport;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmotionReportResponseDto {
    private DailyReport report; // ✅ 이 필드가 있으면 생성자 시그니처가 다르게 생성됨

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyReport {
        private LocalDate date;
        private String mainEmotion;
        private float score;
        private float stable;
        private float joy;
        private float sadness;
        private float anger;
        private float anxiety;
        private String summary;
        private String feedback;
        private String encouragement;

        public static DailyReport from(DailyEmotionReport report) {
            return DailyReport.builder()
                    .date(report.getDate())
                    .mainEmotion(report.getMainEmotion())
                    .score(report.getScore())
                    .stable(report.getStable())
                    .joy(report.getJoy())
                    .sadness(report.getSadness())
                    .anger(report.getAnger())
                    .anxiety(report.getAnxiety())
                    .summary(report.getSummary())
                    .feedback(report.getFeedback())
                    .encouragement(report.getEncouragement())
                    .build();
        }
    }
}
