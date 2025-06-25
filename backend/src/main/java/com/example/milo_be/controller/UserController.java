package com.example.milo_be.controller;

import com.example.milo_be.JWT.JwtUtil;
import com.example.milo_be.dto.*;
import com.example.milo_be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * 회원가입 요청
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRequestDto dto) {
        userService.registerUser(dto);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    /**
     * 아이디 중복 확인 요청
     */
    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String id) {
        boolean isAvailable = userService.isUserIdAvailable(id);
        return ResponseEntity.ok(isAvailable);
    }

    /**
     * 로그인 요청
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginDto) {
        LoginResponseDto response = userService.login(loginDto.getUserId(), loginDto.getPassword());
        return ResponseEntity.ok(response);
    }


    /**
     * 회원탈퇴 요청 (비밀번호 확인 포함)
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> requestBody
    ) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String password = requestBody.get("password");

            boolean deleted = userService.deleteUserWithPassword(userId, password);
            if (deleted) {
                return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("비밀번호가 일치하지 않습니다.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("회원탈퇴 실패: " + e.getMessage());
        }
    }

    /**
     * 닉네임 변경 요청
     */
    @PatchMapping("/nickname")
    public ResponseEntity<String> updateNickname(
            @RequestHeader("Authorization") String token,
            @RequestBody NicknameRequestDto requestDto
    ) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            String newNickname = requestDto.getNickname();  // ✅ DTO에서 가져오기

            userService.updateNickname(userId, newNickname);
            return ResponseEntity.ok("닉네임이 성공적으로 변경되었습니다.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("닉네임 변경 실패: " + e.getMessage());
        }
    }

    /**
     * 회원 정보 요청
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);
            UserResponseDto userInfo = userService.getUserInfo(userId);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * 회원 비밀번호 변경 요청
     */
    @PatchMapping("/password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordRequestDto dto
    ) {
        try {
            String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
            String userId = jwtUtil.getUserIdFromToken(jwt);

            userService.changePassword(userId, dto.getCurrentPassword(), dto.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 변경 실패: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    /**
     * 사용자 리포트 상태 확인 (신규가입자, 리포트 경험, 오늘 리포트 여부)
     */
    @GetMapping("/status")
    public ResponseEntity<UserReportStatusDto> getUserStatus(@RequestHeader("Authorization") String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
        String userId = jwtUtil.getUserIdFromToken(jwt);
        UserReportStatusDto status = userService.getUserReportStatus(userId);
        return ResponseEntity.ok(status);
    }
}
