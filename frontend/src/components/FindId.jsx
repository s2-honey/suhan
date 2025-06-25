import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindId.css';

function FindId() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleFindId = (e) => {
    e.preventDefault();

    // 예시: 고정된 사용자 정보
    const fakeDatabase = [
      { name: '이수정', email: 'happy4024@naver.com', id: 'Ehfl04' },
      // 필요시 여러 데이터 추가 가능
    ];

    const match = fakeDatabase.find(
      (user) => user.name === name && user.email === email
    );

    setFoundId(match ? match.id : '');
    setSearchAttempted(true);
  };

  return (
    <div className="findid-container">
      <h2 className="findid-title">아이디 찾기</h2>
      <form onSubmit={handleFindId} className="findid-form">
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">아이디 찾기</button>
      </form>

      {searchAttempted && (
        <div className="result-box">
          <h3>회원님의 아이디를 확인해 주세요</h3>
          {foundId ? (
            <div className="success-box">
              <p className="found-id">{foundId}</p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
                <button
                  onClick={() => navigate('/find-password')}
                  className="blue-btn"
                >
                  비밀번호찾기
                </button>
              </div>
            </div>
          ) : (
            <div className="fail-box">
              <p className="no-result">조회결과가 없습니다.</p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
                <button
                  onClick={() => navigate('/find-password')}
                  className="blue-btn"
                >
                  비밀번호찾기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindId;
