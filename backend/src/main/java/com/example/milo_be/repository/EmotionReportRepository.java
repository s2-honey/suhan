package com.example.milo_be.repository;

import com.example.milo_be.domain.entity.DailyEmotionReport;
import com.example.milo_be.domain.entity.User;
import com.example.milo_be.dto.DayEmotionDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmotionReportRepository extends JpaRepository<DailyEmotionReport, Long> {

    /**
     * 특정 사용자와 날짜로 리포트를 조회
     */
    Optional<DailyEmotionReport> findByUserAndDate(User user, LocalDate date);

    // ✅ 리포트를 한 번이라도 쓴 적이 있는가
    boolean existsByUser(User user);

    // ✅ 오늘 리포트를 썼는가
    boolean existsByUserAndDate(User user, LocalDate date);

    /**
     * ✅ 사용자별 특정 월의 리포트 날짜(day 숫자) 목록 조회
     */
    @Query("SELECT DAY(r.date) " +
            "FROM DailyEmotionReport r " +
            "WHERE r.user = :user " +
            "AND r.date BETWEEN :startDate AND :endDate")
    List<Integer> findReportDaysByUserAndMonth(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // src/main/java/com/example/milo_be/repository/EmotionReportRepository.java
    @Query("""
   SELECT NEW com.example.milo_be.dto.DayEmotionDto(r.date, r.mainEmotion)
   FROM DailyEmotionReport r
   WHERE r.user = :user
     AND r.date BETWEEN :startDate AND :endDate
   ORDER BY r.date DESC
""")
    List<DayEmotionDto> findDayAndEmotionByUserAndMonth(
            @Param("user")      User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate")   LocalDate endDate);
}
