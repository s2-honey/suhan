package com.example.milo_be.repository;

import com.example.milo_be.domain.entity.RecoveryFolder;
import com.example.milo_be.domain.entity.RecoverySentence;
import com.example.milo_be.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecoverySentenceRepository extends JpaRepository<RecoverySentence, Long> {
    List<RecoverySentence> findAllByFolderAndUser(RecoveryFolder folder, User user);
    void deleteAllByFolder(RecoveryFolder folder); // 회복 문장 전체 삭제
    List<RecoverySentence> findAllByUserAndContent(User user, String content);
    int countByFolder(RecoveryFolder folder);
}
