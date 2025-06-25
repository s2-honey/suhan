// src/main/java/com/example/milo_be/dto/UserResponseDto.java
package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponseDto {
    private String userId;
    private String nickname;
    private String email;
}
