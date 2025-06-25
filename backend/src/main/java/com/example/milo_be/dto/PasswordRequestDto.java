// src/main/java/com/example/milo_be/dto/PasswordRequestDto.java
package com.example.milo_be.dto;

import lombok.Getter;

@Getter
public class PasswordRequestDto {
    private String currentPassword;
    private String newPassword;
}