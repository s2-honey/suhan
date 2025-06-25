package com.example.milo_be.domain.entity;

import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users_TB")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "USER_ID", length = 50)
    private String userId;

    @Setter
    @Column(name = "PASSWORD", nullable = false, length = 100)
    private String password;

    // ✅ 닉네임 변경용 setter 추가
    @Setter
    @Column(name = "NICKNAME", nullable = false, length = 50)
    private String nickname;

    @Column(name = "EMAIL", nullable = false, length = 100, unique = true)
    private String email;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Setter
    @Column(name = "EMOTION_PROMPT")
    private Integer emotionPrompt;  // 0 = 공감형, 1 = 조언형
}
