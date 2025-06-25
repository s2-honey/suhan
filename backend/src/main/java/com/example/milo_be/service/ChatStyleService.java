package com.example.milo_be.service;

import com.example.milo_be.domain.entity.User;
import com.example.milo_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatStyleService {

    private final UserRepository userRepository;

    /**
     * 챗봇 대화 스타일 조회
     */
    public String getPromptType(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("해당 사용자가 존재하지 않습니다."));
        return user.getEmotionPrompt() == 0 ? "emotional" : "practical";
    }

    /**
     * 챗봇 대화 스타일 변경
     */
    @Transactional
    public void updatePrompt(String userId, int promptValue) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다: " + userId));
        user.setEmotionPrompt(promptValue);
        userRepository.save(user);
    }
}