package com.example.milo_be.service;

import com.example.milo_be.domain.entity.User;
import com.example.milo_be.domain.entity.RecoveryFolder;
import com.example.milo_be.domain.entity.RecoverySentence;
import com.example.milo_be.dto.RecoveryStorageResponseDto;
import com.example.milo_be.repository.RecoveryFolderRepository;
import com.example.milo_be.repository.RecoverySentenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecoveryStorageService {

    private final RecoveryFolderRepository recoveryFolderRepository;
    private final RecoverySentenceRepository recoverySentenceRepository;

    // ✅ 1. 사용자 폴더 생성
    public RecoveryStorageResponseDto.RecoveryFolderResponse createFolder(User user, String folderName) {
        boolean exists = recoveryFolderRepository.existsByUserAndFolderName(user, folderName);
        if (exists) {
            throw new IllegalArgumentException("이미 존재하는 폴더명이에요.");
        }

        RecoveryFolder folder = recoveryFolderRepository.save(
                RecoveryFolder.builder()
                        .user(user)
                        .folderName(folderName)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return RecoveryStorageResponseDto.RecoveryFolderResponse.builder()
                .folderId(folder.getFolderId())
                .folderName(folder.getFolderName())
                .createdAt(folder.getCreatedAt())
                .build();
    }

    // ✅ 2. 사용자 폴더 수정
    public void updateFolderName(User user, Long folderId, String updatedName) {
        RecoveryFolder folder = recoveryFolderRepository.findByFolderIdAndUser(folderId, user)
                .orElseThrow(() -> new IllegalArgumentException("폴더가 존재하지 않습니다."));

        if (recoveryFolderRepository.existsByUserAndFolderName(user, updatedName)) {
            throw new IllegalArgumentException("이미 존재하는 폴더 이름입니다.");
        }

        folder.setFolderName(updatedName);
        recoveryFolderRepository.save(folder);
    }
    
    // ✅ 2. 사용자 폴더 삭제
    @Transactional
    public void deleteFolder(User user, Long folderId) {
        RecoveryFolder folder = recoveryFolderRepository.findById(folderId)
                .orElseThrow(() -> new IllegalArgumentException("폴더를 찾을 수 없습니다."));

        if (!folder.getUser().equals(user)) {
            throw new IllegalArgumentException("해당 폴더에 대한 권한이 없습니다.");
        }

        // 해당 폴더에 있는 회복 문장 모두 삭제
        recoverySentenceRepository.deleteAllByFolder(folder);

        // 폴더 삭제
        recoveryFolderRepository.delete(folder);
    }

    // ✅ 3. 사용자 폴더 조회
    public List<RecoveryStorageResponseDto.RecoveryFolderResponse> getFolders(User user) {
        return recoveryFolderRepository.findAllByUser(user)
                .stream()
                .map(folder -> {
                    int sentenceCount = recoverySentenceRepository.countByFolder(folder); // ✅ 문장 개수 구하기
                    return RecoveryStorageResponseDto.RecoveryFolderResponse.builder()
                            .folderId(folder.getFolderId())
                            .folderName(folder.getFolderName())
                            .createdAt(folder.getCreatedAt())
                            .sentenceCount(sentenceCount)
                            .build();
                })
                .toList();
    }

    // ✅ 4 .회복 문장 저장
    public RecoveryStorageResponseDto.RecoverySentenceResponse saveSentence(User user, RecoveryFolder folder, String content) {
        RecoverySentence sentence = recoverySentenceRepository.save(
                RecoverySentence.builder()
                        .user(user)
                        .folder(folder)
                        .content(content)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return RecoveryStorageResponseDto.RecoverySentenceResponse.builder()
                .sentenceId(sentence.getSentenceId())
                .content(sentence.getContent())
                .folderId(folder.getFolderId())
                .createdAt(sentence.getCreatedAt())
                .build();
    }

    // ✅ 5. 회복 문장 전체 삭제
    @Transactional
    public void deleteSentenceFromAllFolders(User user, String content) {
        List<RecoverySentence> sentenceList =
                recoverySentenceRepository.findAllByUserAndContent(user, content);

        if (sentenceList.isEmpty()) {
            throw new IllegalArgumentException("삭제할 문장이 없습니다.");
        }

        recoverySentenceRepository.deleteAll(sentenceList);
    }

    // ✅ 6. 마음서랍장 - 회복 문장 하나 삭제
    @Transactional
    public void deleteSentenceInFolder(User user, Long folderId,  Long sentenceId) {
        RecoveryFolder folder = recoveryFolderRepository.findByFolderIdAndUser(folderId, user)
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        // 해당 유저 소유 폴더인지 확인
        if (!folder.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("해당 폴더에 접근할 수 없습니다.");
        }

        RecoverySentence sentence = recoverySentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("문장을 찾을 수 없습니다."));


        recoverySentenceRepository.delete(sentence); // ✅ 정확히 하나만 삭제
    }

    // ✅ 7. 폴더별 회복 문장 조회
    public List<RecoveryStorageResponseDto.RecoverySentenceResponse> getSentenceByFolder(RecoveryFolder folder, User user) {
        return recoverySentenceRepository.findAllByFolderAndUser(folder, user)
                .stream()
                .map(sentence -> RecoveryStorageResponseDto.RecoverySentenceResponse.builder()
                        .sentenceId(sentence.getSentenceId())
                        .content(sentence.getContent())
                        .folderId(sentence.getFolder().getFolderId())
                        .createdAt(sentence.getCreatedAt())
                        .build())
                .toList();
    }

    // ✅ 8. 회복 문장 수정
    @Transactional
    public void updateSentence(User user, Long sentenceId, String updatedContent) {
        RecoverySentence sentence = recoverySentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new IllegalArgumentException("문장을 찾을 수 없습니다."));

        // 사용자 소유 확인 (선택)
        if (!sentence.getUser().equals(user)) {
            throw new AccessDeniedException("수정 권한이 없습니다.");
        }

        sentence.setContent(updatedContent);
    }
}