package com.example.milo_be.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_emotion_summary_TB",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"USER_ID", "YEAR_MONTHS"})})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEmotionSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUMMARY_ID")
    private Long summaryId;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "YEAR_MONTHS", nullable = false)
    private LocalDate yearMonths;

    @Column(name = "TOTAL_SESSIONS", nullable = false)
    private int totalSessions = 0;

    @Column(name = "AVG_STABLE", nullable = false)
    private float avgStable;

    @Column(name = "AVG_JOY", nullable = false)
    private float avgJoy;

    @Column(name = "AVG_SADNESS", nullable = false)
    private float avgSadness;

    @Column(name = "AVG_ANGER", nullable = false)
    private float avgAnger;

    @Column(name = "AVG_ANXIETY", nullable = false)
    private float avgAnxiety;

    @Column(name = "DOMINANT_EMOTION", length = 20)
    private String dominantEmotion;

    @Column(name = "GPT_FEEDBACK", columnDefinition = "TEXT")
    private String gptFeedback;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
