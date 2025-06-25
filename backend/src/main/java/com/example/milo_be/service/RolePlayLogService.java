package com.example.milo_be.service;

import com.example.milo_be.domain.entity.RoleCharacter;
import com.example.milo_be.domain.entity.RolePlayLog;
import com.example.milo_be.dto.RolePlayLogDto;
import com.example.milo_be.repository.RoleCharacterRepository;
import com.example.milo_be.repository.RolePlayLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolePlayLogService {

    private final RolePlayLogRepository rolePlayLogRepository;
    private final RoleCharacterRepository roleCharacterRepository;

    /**
     * ✅ 사용자 ID 기반으로 역할극 대화 로그 전체 조회
     */
    public List<RolePlayLogDto> fetchLogs(String userId) {
        List<RolePlayLog> logs = rolePlayLogRepository.findByUser_UserIdOrderByCreatedAtAsc(userId);

        return logs.stream()
                .map(log -> new RolePlayLogDto(
                        log.getSender(),
                        log.getResponder(),
                        log.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                ))
                .collect(Collectors.toList());
    }

    /**
     * ✅ 역할극 종료 시, 해당 유저의 대화 로그와 역할 정보 삭제
     */
    public void deleteRolePlayDataByUserId(String userId) {
        // 1. 사용자에 대한 역할 정보 조회
        RoleCharacter character = roleCharacterRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("등록된 역할이 없습니다."));

        // 2. 해당 역할 정보 삭제 (대화 로그는 DB에서 cascade로 자동 삭제 or 직접 삭제)
        roleCharacterRepository.delete(character);

        // (선택적으로 로그를 먼저 지우고 싶다면 아래 라인도 추가 가능)
        // rolePlayLogRepository.deleteAll(rolePlayLogRepository.findByUser_UserIdOrderByCreatedAtAsc(userId));
    }
}
