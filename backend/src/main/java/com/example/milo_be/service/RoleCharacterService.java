package com.example.milo_be.service;

import com.example.milo_be.domain.entity.RoleCharacter;
import com.example.milo_be.domain.entity.User;
import com.example.milo_be.dto.RoleCharacterDto;
import com.example.milo_be.repository.RoleCharacterRepository;
import com.example.milo_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleCharacterService {

    private final RoleCharacterRepository roleCharacterRepository;
    private final UserRepository userRepository;

    public Long save(RoleCharacterDto dto) {
        // ✅ 사용자 조회
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // ✅ 기존 역할 존재 여부 검사 (1인 1캐릭터 정책)
        roleCharacterRepository.findByUser(user).ifPresent(c -> {
            throw new IllegalStateException("이미 등록된 역할이 있습니다. 먼저 삭제해야 합니다.");
        });

        // ✅ 역할 저장
        RoleCharacter character = RoleCharacter.builder()
                .user(user)
                .name(dto.getName())
                .relationship(dto.getRelationship())
                .tone(dto.getTone())
                .personality(dto.getPersonality())
                .situation(dto.getSituation())
                .build();

        return roleCharacterRepository.save(character).getCharacterId();
    }

    // RoleCharacterService.java
    public boolean existsByUserId(String userId) {
        return roleCharacterRepository.existsByUser_UserId(userId);
    }
}
