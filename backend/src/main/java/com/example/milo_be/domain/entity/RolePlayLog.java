package com.example.milo_be.domain.entity;

import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "role_play_log_TB")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolePlayLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROLE_CHAT_ID")
    private Long roleChatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHARACTER_ID", nullable = false)
    private RoleCharacter roleCharacter;

    @Column(name = "SENDER", nullable = false, columnDefinition = "TEXT")
    private String sender;

    @Column(name = "RESPONDER", nullable = false, columnDefinition = "TEXT")
    private String responder;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
