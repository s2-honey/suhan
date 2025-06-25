// src/main/java/com/example/milo_be/dto/DayEmotionDto.java
package com.example.milo_be.dto;

import java.time.LocalDate;

public record DayEmotionDto(LocalDate date, String mainEmotion) { }