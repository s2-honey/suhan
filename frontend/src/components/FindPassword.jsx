import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindPassword.css';

function FindPassword() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFindPassword = (e) => {
    e.preventDefault();

    // ✅ 임시 로직: 예시 사용자 정보
    const fakeDatabase = [
      { id: 'Ehfl04', email: 'happy4024@naver.com' },
      // 필요시 추가
    ];

    const match = fakeDatabase.find(
      (user) => user.name === name && user.id === id && user.email === email
    );

    setPasswordResetSuccess(!!match);
    setSearchAttempted(true);
  };

  return (
    <div className="findpw-container">
      <h2 className="findpw-title">비밀번호 찾기</h2>
      <form onSubmit={handleFindPassword} className="findpw-form">
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">비밀번호 찾기</button>
      </form>

      {searchAttempted && (
        <div className="result-box">
          {passwordResetSuccess ? (
            <div className="success-box">
              <p>등록된 이메일로 임시 비밀번호를 전송했습니다.</p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
              </div>
            </div>
          ) : (
            <div className="fail-box">
              <p className="no-result">일치하는 정보가 없습니다.</p>
              <div className="button-group">
                <button
                  onClick={() => navigate('/find-id')}
                  className="blue-btn"
                >
                  아이디 찾기
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="gray-btn"
                >
                  회원가입 하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindPassword;
