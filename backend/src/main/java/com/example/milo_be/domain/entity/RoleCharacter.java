package com.example.milo_be.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "role_character_TB")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHARACTER_ID")
    private Long characterId;

    // ✅ 회원 ID: 사용자와 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "NAME", nullable = false, length = 50)
    private String name;

    @Column(name = "RELATIONSHIP", nullable = false, length = 50)
    private String relationship;

    @Column(name = "TONE", nullable = false, length = 50)
    private String tone;

    @Column(name = "PERSONALITY", nullable = false, columnDefinition = "TEXT")
    private String personality;

    @Column(name = "SITUATION", nullable = false, columnDefinition = "TEXT")
    private String situation;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
