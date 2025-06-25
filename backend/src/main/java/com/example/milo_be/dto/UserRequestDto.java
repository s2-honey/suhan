package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String userId;
    private String password;
    private String nickname;
    private String email;
    private Integer emotionPrompt;
}