package com.example.milo_be.service;

import com.example.milo_be.domain.entity.RoleCharacter;
import com.example.milo_be.repository.RoleCharacterRepository;
import com.example.milo_be.dto.RolePlayRequestDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class FastApiService {

    private final RestTemplate restTemplate;
    private final RoleCharacterRepository roleCharacterRepository;

    private static final String CHAT_URL = "http://192.168.219.48:8000/api/roleplay/chat";

    /**
     * ✅ 사용자 ID로 캐릭터 ID 조회 → FastAPI로 전달
     */
    public String sendChatToFastAPI(String userId, String input) {
        // 1. 역할 ID 조회 (1:1 관계 가정)
        RoleCharacter character = roleCharacterRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("등록된 역할이 없습니다."));

        // 2. FastAPI에 전달할 DTO 구성
        RolePlayRequestDto dto = new RolePlayRequestDto();
        dto.setUser_id(userId);
        dto.setCharacter_id(character.getCharacterId());
        dto.setInput(input);

        // 3. HTTP 요청
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<RolePlayRequestDto> request = new HttpEntity<>(dto, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(CHAT_URL, request, String.class);

            // 응답 파싱
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode outputNode = root.get("output");

            return outputNode != null ? outputNode.asText() : "응답 텍스트를 불러오지 못했습니다.";

        } catch (Exception e) {
            log.error("❌ 역할극 대화 요청 실패", e);
            return "역할극 응답 처리 중 오류가 발생했어요.";
        }
    }
}
