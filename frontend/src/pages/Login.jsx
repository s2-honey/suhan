// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginCharacter from '../assets/characters/login-character.png';
import Swal from 'sweetalert2';
import api from '../config/axios'; // ✅ axios 인스턴스 사용

function Login() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleNavigate = (path) => {
    setFadeOut(true);
    setTimeout(() => navigate(path), 300);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/users/login', {
        userId: id,
        password: password,
      });

      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); // ✅ userId도 저장

      Swal.fire({
        title: '로그인 완료!',
        text: '환영합니다 😊',
        icon: 'success',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
      }).then(() => {
        setFadeOut(true);
        setTimeout(() => navigate('/main'), 300);
      });
    } catch (error) {
      console.error('로그인 실패:', error);

      Swal.fire({
        title: '로그인 실패!',
        text:
          error.response?.data?.message ||
          '아이디 또는 비밀번호를 확인해주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className={`Login ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-container">
        <div className="character-logo">
          <img src={loginCharacter} alt="milo 캐릭터" className="character1" />
          <h2 className="logo1">Milo.</h2>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          아이디
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          비밀번호
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="find-info">
            <span onClick={() => handleNavigate('/find-id')}>아이디 찾기</span>{' '}
            |{' '}
            <span onClick={() => handleNavigate('/find-password')}>
              비밀번호 찾기
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          아직 계정이 없으신가요?{' '}
          <span onClick={() => handleNavigate('/signup')}>Signup</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
