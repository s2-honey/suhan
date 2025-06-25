package com.example.milo_be.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class RecoveryStorageResponseDto {

    @Getter
    @Setter
    @Builder
    public static class RecoveryFolderResponse {
        private Long folderId;
        private String folderName;
        private LocalDateTime createdAt;
        private int sentenceCount;  // ✅ 문장 개수 추가
    }

    @Getter
    @Setter
    @Builder
    public static class RecoverySentenceResponse {
        private Long sentenceId;
        private String content;
        private Long folderId;
        private LocalDateTime createdAt;
    }
}
