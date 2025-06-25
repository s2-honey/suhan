package com.example.milo_be.controller;

import com.example.milo_be.dto.ChatDto;
import com.example.milo_be.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    /**
     * 채팅 첫 진입 인사
     */
    @GetMapping("/chat/init")
    public ResponseEntity<?> getInitialGreeting(@RequestParam("user_id") String userId) {
        try {
            ChatDto.ChatResponse response = chatService.getInitialGreeting(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("초기 인사 메시지 호출 실패: " + e.getMessage());
        }
    }

    /**
     * 채팅
     */
    @PostMapping("/chat/send")
    public ResponseEntity<?> sendMessage(
            @RequestHeader("Authorization") String token,
            @RequestBody ChatDto.ChatRequest request) {
        try {
            ChatDto.ChatResponse response = chatService.processChat(token, request.getMessage());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("FastAPI 오류: " + e.getMessage());
        }
    }

    /**
     * 채팅 종료 및 리포트 요청
     */
    @PostMapping("/session/end")
    public ResponseEntity<?> endChat(@RequestHeader("Authorization") String token) {
        chatService.endChat(token);
        return ResponseEntity.ok("채팅 종료 및 리포트 생성 요청 완료");
    }
}