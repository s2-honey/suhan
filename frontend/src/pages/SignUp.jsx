// src/components/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import api from '../config/axios'; // ✅ axios 인스턴스 사용
import Swal from 'sweetalert2';

function SignUp() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const [id, setId] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [passwordFormatError, setPasswordFormatError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [agreementError, setAgreementError] = useState('');

  const handleCheckDuplicate = async () => {
    if (!id) {
      setIdMessage('아이디를 입력해주세요.');
      return;
    }

    try {
      const response = await api.get('/api/users/check-id', {
        params: { id },
      });

      if (response.data === true) {
        setIsIdAvailable(true);
        setIdMessage('사용 가능한 아이디입니다.');
      } else {
        setIsIdAvailable(false);
        setIdMessage('이미 존재하는 아이디입니다.');
      }
    } catch (error) {
      console.error(error);
      setIsIdAvailable(false);
      setIdMessage('⚠️ 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordFormatError('');
    setPasswordMatchError('');
    setAgreementError('');

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,20}$/;

    if (!passwordRegex.test(password)) {
      setPasswordFormatError(
        '비밀번호는 8~20자, 문자/숫자/특수문자를 포함해야 합니다.'
      );
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreeService || !agreePrivacy) {
      setAgreementError('약관 동의는 필수입니다.');
      return;
    }

    try {
      const response = await api.post('/api/users/register', {
        userId: id,
        password,
        nickname,
        email,
      });

      Swal.fire({
        title: '회원가입 완료!',
        text: '로그인 페이지로 이동합니다 😊',
        icon: 'success',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
      }).then(() => {
        setFadeOut(true);
        setTimeout(() => navigate('/login'), 300);
      });
    } catch (error) {
      Swal.fire({
        title: '회원가입 실패!',
        text: error.response?.data || '서버 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className={`signup ${fadeOut ? 'fade-out' : ''}`}>
      <div className="signup">
        <h2 className="logo2">Milo.</h2>
        <p className="subtitle">가입을 환영합니다.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>아이디</label>
          <div className="input-with-button">
            <input
              type="text"
              placeholder="아이디 입력(6~20자)"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleCheckDuplicate}
            >
              중복확인
            </button>
          </div>
          {isIdAvailable !== null && (
            <p className={`id-message ${isIdAvailable ? 'valid' : 'invalid'}`}>
              {idMessage}
            </p>
          )}

          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력(비밀번호는 8~20자, 문자/숫자/특수문자 포함)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordFormatError && (
            <p className="error-message">{passwordFormatError}</p>
          )}

          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}

          <label>닉네임</label>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="privacy"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            <span
              onClick={() => setShowPrivacyModal(true)}
              className="terms-text"
            >
              개인정보 수집 및 이용
            </span>
            <span className="required">(필수)</span>
            <br />
            <input
              type="checkbox"
              id="service"
              checked={agreeService}
              onChange={(e) => setAgreeService(e.target.checked)}
            />
            <span
              onClick={() => setShowServiceModal(true)}
              className="terms-text"
            >
              서비스 이용약관
            </span>
            <span className="required">(필수)</span>
          </div>

          {agreementError && <p className="error-message">{agreementError}</p>}

          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>

        {showPrivacyModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>개인정보 수집 및 이용</h3>
              <p>이곳에 개인정보 수집 약관 내용을 넣어주세요.</p>
              <button onClick={() => setShowPrivacyModal(false)}>닫기</button>
            </div>
          </div>
        )}

        {showServiceModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>서비스 이용약관</h3>
              <p>이곳에 서비스 이용약관 내용을 넣어주세요.</p>
              <button onClick={() => setShowServiceModal(false)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
