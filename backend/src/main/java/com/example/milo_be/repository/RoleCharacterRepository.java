package com.example.milo_be.repository;

import com.example.milo_be.domain.entity.RoleCharacter;
import com.example.milo_be.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleCharacterRepository extends JpaRepository<RoleCharacter, Long> {

    // ✅ 특정 사용자에 대해 등록된 역할이 있는지 조회 (1인 1캐릭터 제약용)
    Optional<RoleCharacter> findByUser(User user);

    // RoleCharacterRepository.java
    boolean existsByUser_UserId(String userId);

    Optional<RoleCharacter> findByUser_UserId(String userId);

}
