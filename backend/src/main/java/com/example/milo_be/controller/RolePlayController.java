package com.example.milo_be.controller;

import com.example.milo_be.dto.RolePlayRequestDto;
import com.example.milo_be.dto.RolePlayLogDto;
import com.example.milo_be.service.FastApiService;
import com.example.milo_be.service.RolePlayLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roleplay")
@RequiredArgsConstructor
public class RolePlayController {

    private final FastApiService fastApiService;
    private final RolePlayLogService rolePlayLogService;

    /**
     * 역할극 요청 → FastAPI로 input 보내고 output 받아오기
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> rolePlay(@RequestBody RolePlayRequestDto request) {
        String output = fastApiService.sendChatToFastAPI(request.getUser_id(), request.getInput());
        return ResponseEntity.ok(Map.of("output", output));
    }

    /**
     * 역할극 전체 대화 로그 조회 → FastAPI에 조회 요청
     */
    @GetMapping("/logs")
    public ResponseEntity<List<RolePlayLogDto>> getRolePlayLogs(@RequestParam String userId) {
        List<RolePlayLogDto> logs = rolePlayLogService.fetchLogs(userId);
        return ResponseEntity.ok(logs);
    }
}
