package com.example.milo_be.dto;

import lombok.*;

public class RecoveryStorageRequestDto {

    @Getter
    @Setter
    public static class RecoveryFolderCreateRequest {
        // 폴더 생성
        private String folderName;
    }

    @Getter
    @Setter
    public static class RecoveryFolderUpdateRequest {
        // 폴더 수정
        private Long folderId;
        private String updatedName;
    }

    @Getter
    @Setter
    public static class RecoveryFolderDeleteRequest {
        // 폴더 삭제
        private Long folderId;
        private String content;
    }

    @Getter
    @Setter
    public static class RecoverySentenceRequest {
        // 문장 저장
        private Long folderId;
        private String content;
    }

    @Getter
    @Setter
    public static class FolderSentenceDeleteRequest {
        // 문장 삭제
        private Long folderId;
        private Long sentenceId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FolderSentenceUpdateRequest {
        // 문장 수정
        private Long sentenceId;
        private String updatedContent;
    }
}
