package com.example.milo_be.controller;

import com.example.milo_be.dto.RoleCharacterDto;
import com.example.milo_be.service.RoleCharacterService;
import com.example.milo_be.service.RolePlayLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/character")
@RequiredArgsConstructor
public class RoleCharacterController {

    private final RoleCharacterService roleCharacterService;
    private final RolePlayLogService rolePlayLogService;

    @PostMapping
    public ResponseEntity<Long> saveCharacter(@RequestBody RoleCharacterDto dto) {
        Long characterId = roleCharacterService.save(dto);
        return ResponseEntity.ok(characterId);
    }

    @GetMapping("/{userId}/exists")
    public ResponseEntity<Boolean> checkIfCharacterExists(@PathVariable String userId) {
        boolean exists = roleCharacterService.existsByUserId(userId);
        return ResponseEntity.ok(exists);
    }

    // ✅ 역할 및 대화 로그 삭제 API 추가
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteCharacterAndLogs(@PathVariable String userId) {
        rolePlayLogService.deleteRolePlayDataByUserId(userId); // 서비스에서 캐릭터+로그 함께 삭제
        return ResponseEntity.noContent().build();
    }
}

