package com.example.milo_be.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolePlayRequestDto {
    private String user_id;        // FastAPI에서 기대하는 JSON 키 이름
    private Long character_id;
    private String input;
}