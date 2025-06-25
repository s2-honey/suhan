package com.example.milo_be.repository;

import com.example.milo_be.domain.entity.RecoveryFolder;
import com.example.milo_be.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecoveryFolderRepository extends JpaRepository<RecoveryFolder, Long> {
    boolean existsByUserAndFolderName(User user, String folderName);
    List<RecoveryFolder> findAllByUser(User user);
    Optional<RecoveryFolder> findByFolderIdAndUser(Long folderId, User user);
}

