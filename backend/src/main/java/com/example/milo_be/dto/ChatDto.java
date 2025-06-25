package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

public class ChatDto {

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ChatRequest {
        private String message;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ChatResponse {
        private String output;
    }
}