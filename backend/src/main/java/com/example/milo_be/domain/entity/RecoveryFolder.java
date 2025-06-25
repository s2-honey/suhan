package com.example.milo_be.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_folder_TB",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"USER_ID", "FOLDER_NAME"})})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecoveryFolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FOLDER_ID")
    private Long folderId;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Setter
    @Column(name = "FOLDER_NAME", nullable = false, length = 100)
    private String folderName;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
