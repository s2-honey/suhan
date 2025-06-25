package com.example.milo_be.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 하루 감정 리포트 엔터티
 * 사용자별 하루 감정 기록 및 분석 결과 저장
 */

@Entity
@Table(name = "daily_emotion_report_TB",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"USER_ID", "DATE"})})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyEmotionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REPORT_ID")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "DATE", nullable = false)
    private LocalDate date;

    @Column(name = "MAIN_EMOTION", nullable = false, length = 20)
    private String mainEmotion;

    @Column(name = "SCORE", nullable = false)
    private float score;

    @Column(name = "STABLE", nullable = false)
    private float stable;

    @Column(name = "JOY", nullable = false)
    private float joy;

    @Column(name = "SADNESS", nullable = false)
    private float sadness;

    @Column(name = "ANGER", nullable = false)
    private float anger;

    @Column(name = "ANXIETY", nullable = false)
    private float anxiety;

    @Column(name = "SUMMARY", nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "FEEDBACK", nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "ENCOURAGEMENT", nullable = false, columnDefinition = "TEXT")
    private String encouragement;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
