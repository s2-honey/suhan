// RolePlayLogDto.java
package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RolePlayLogDto {
    private String sender;
    private String responder;
    private String createdAt;
}
