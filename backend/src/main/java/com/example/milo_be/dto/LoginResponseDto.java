package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;   // JWT 토큰
    private String userId;  // 사용자 ID
}
