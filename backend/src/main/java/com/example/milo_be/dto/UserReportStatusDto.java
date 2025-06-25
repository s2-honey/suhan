package com.example.milo_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserReportStatusDto {
    private boolean isNewUser;
    private boolean hasAnyReport;
    private boolean hasTodayReport;
}
