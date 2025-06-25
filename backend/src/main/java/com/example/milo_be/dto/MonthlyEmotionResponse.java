package com.example.milo_be.dto;

import com.example.milo_be.domain.entity.MonthlyEmotionSummary;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlyEmotionResponse {
    private float avgStable;
    private float avgJoy;
    private float avgSadness;
    private float avgAnger;
    private float avgAnxiety;
    private String dominantEmotion;
    private String gptFeedback;

    public static MonthlyEmotionResponse from(MonthlyEmotionSummary entity) {
        return new MonthlyEmotionResponse(
                entity.getAvgStable(),
                entity.getAvgJoy(),
                entity.getAvgSadness(),
                entity.getAvgAnger(),
                entity.getAvgAnxiety(),
                entity.getDominantEmotion(),
                entity.getGptFeedback()
        );
    }
}