package com.example.milo_be.domain.entity;

import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * chat_log_TB 테이블 매핑 엔터티
 * 사용자와 챗봇 간의 1건 대화 기록 저장용
 */
@Entity
@Table(name = "chat_log_TB")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_ID")
    private Long chatId;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "SENDER", nullable = false, columnDefinition = "TEXT")
    private String sender;

    @Column(name = "RESPONDER", nullable = false, columnDefinition = "TEXT")
    private String responder;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

