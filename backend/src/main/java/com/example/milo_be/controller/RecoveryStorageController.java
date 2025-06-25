package com.example.milo_be.controller;

import com.example.milo_be.JWT.JwtUtil;
import com.example.milo_be.domain.entity.RecoveryFolder;
import com.example.milo_be.domain.entity.User;
import com.example.milo_be.dto.RecoveryStorageRequestDto;
import com.example.milo_be.dto.RecoveryStorageResponseDto;
import com.example.milo_be.repository.RecoveryFolderRepository;
import com.example.milo_be.repository.UserRepository;
import com.example.milo_be.service.RecoveryStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery")
@RequiredArgsConstructor
public class RecoveryStorageController {
    private final JwtUtil jwtUtil;
    private final RecoveryStorageService recoveryStorageService;
    private final UserRepository userRepository;
    private final RecoveryFolderRepository recoveryFolderRepository;

    // ✅ 1. 사용자 폴더 생성
    @PostMapping("/folder/create")
    public ResponseEntity<?> createFolder(
            @RequestBody RecoveryStorageRequestDto.RecoveryFolderCreateRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            User user = userRepository.findById(userId).get();

            RecoveryStorageResponseDto.RecoveryFolderResponse response = recoveryStorageService.createFolder(user, request.getFolderName());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // ✅ 400 응답 + 메시지
        }
    }

    // ✅ 2. 사용자 폴더 수정
    @PutMapping("/folder/update")
    public ResponseEntity<?> updateFolder(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.RecoveryFolderUpdateRequest request) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            User user = userRepository.findById(userId).orElseThrow();

            recoveryStorageService.updateFolderName(user, request.getFolderId(), request.getUpdatedName());

            return ResponseEntity.ok("수정 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("폴더 수정 실패");
        }
    }

    // ✅ 2. 사용자 폴더 삭제
    @DeleteMapping("/folder")
    public ResponseEntity<?> deleteFolder(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.RecoveryFolderDeleteRequest request) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            User user = userRepository.findById(userId).orElseThrow();

            recoveryStorageService.deleteFolder(user, request.getFolderId());
            return ResponseEntity.ok("삭제 완료");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("폴더 삭제 실패");
        }
    }

    // ✅ 3. 사용자 폴더 전체 조회
    @GetMapping("/folders")
    public ResponseEntity<?> getUserFolders(@RequestHeader("Authorization") String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).get();
        List<RecoveryStorageResponseDto.RecoveryFolderResponse> folders = recoveryStorageService.getFolders(user);
        return ResponseEntity.ok(folders);
    }

    // ✅ 4. 회복 문장 저장
    @PostMapping("/sentence")
    public ResponseEntity<?> saveSentence(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.RecoverySentenceRequest request) {

        // 토큰 파싱
        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).orElseThrow();

        // 폴더 찾기
        RecoveryFolder folder = recoveryFolderRepository.findById(request.getFolderId())
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        // 저장
        RecoveryStorageResponseDto.RecoverySentenceResponse saved = recoveryStorageService.saveSentence(user, folder, request.getContent());

        return ResponseEntity.ok(saved);
    }

    // ✅ 5. 채팅 - 회복 문장 전체 삭제
    @DeleteMapping("/sentence")
    public ResponseEntity<?> deleteSentence(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.RecoverySentenceRequest request) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).orElseThrow();

        recoveryStorageService.deleteSentenceFromAllFolders(user, request.getContent());

        return ResponseEntity.ok("모든 폴더에서 문장이 삭제되었습니다.");
    }

    // ✅ 6. 마음서랍장 - 회복 문장 하나 삭제
    @DeleteMapping("/sentence/folder")
    public ResponseEntity<?> deleteSentenceInFolder(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.FolderSentenceDeleteRequest request) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).orElseThrow();

        recoveryStorageService.deleteSentenceInFolder(user, request.getFolderId(), request.getSentenceId()); // ✅ sentenceId 사용

        return ResponseEntity.ok("폴더에서 문장이 삭제되었습니다.");
    }

    // ✅ 7. 폴더별 회복 문장 조회
    @GetMapping("/sentence/{folderId}")
    public ResponseEntity<?> getSentenceByFolder(
            @RequestHeader("Authorization") String token,
            @PathVariable Long folderId) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).get();

        RecoveryFolder folder = recoveryFolderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        List<RecoveryStorageResponseDto.RecoverySentenceResponse> sentenceList = recoveryStorageService.getSentenceByFolder(folder, user);
        return ResponseEntity.ok(sentenceList);
    }

    // ✅ 8. 회복 문장 수정
    @PutMapping("/sentence/update")
    public ResponseEntity<?> updateSentenceInFolder(
            @RequestHeader("Authorization") String token,
            @RequestBody RecoveryStorageRequestDto.FolderSentenceUpdateRequest request) {

        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        User user = userRepository.findById(userId).orElseThrow();

        recoveryStorageService.updateSentence(user, request.getSentenceId(), request.getUpdatedContent());

        return ResponseEntity.ok("문장이 수정되었습니다.");
    }
}
