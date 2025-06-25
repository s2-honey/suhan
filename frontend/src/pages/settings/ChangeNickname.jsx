import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ChangeNickname.css';
import { useDrawerStore } from '../../stores/useDrawerStore';
import Swal from 'sweetalert2';
import api from '../../config/axios'; // ✅ axios 인스턴스

export default function ChangeNickname() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  const [nickname, setNickname] = useState('');
  const [currentNickname, setCurrentNickname] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  // ✅ 현재 닉네임 불러오기 (GET /api/users/me)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/api/users/me');
        setCurrentNickname(res.data.nickname);
      } catch (err) {
        console.error('닉네임 불러오기 실패', err);
        Swal.fire({
          icon: 'error',
          title: '불러오기 실패',
          text: '사용자 정보를 불러오지 못했습니다.',
        });
      }
    };
    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (trimmed === currentNickname) {
      setError('현재 닉네임과 동일합니다.');
      return;
    }

    try {
      await api.patch('/api/users/nickname', { nickname: trimmed });

      Swal.fire({
        title: '닉네임 변경 완료!',
        text: `'${trimmed}'으로 저장되었어요.`,
        icon: 'success',
        confirmButtonText: '확인',
        confirmButtonColor: '#ff9f4a',
      }).then(() => {
        navigate(-1); // 이전 화면으로
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: '변경 실패',
        text:
          err.response?.data?.message ||
          (typeof err.response?.data === 'string' ? err.response.data : '') ||
          '서버 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="nickname-container">
      {/* 헤더 */}
      <div className="nickname-header">
        <span
          className="nickname-back"
          onClick={() => {
            setShouldAutoOpen(true);
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="nickname-title">닉네임 변경</span>
      </div>

      {/* 본문 */}
      <div className="nickname-wrapper">
        <p className="nickname-guide">닉네임을 변경해주세요.</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? '' : '닉네임을 입력해주세요.'}
          className="nickname-input"
        />
        {error && <p className="nickname-error">{error}</p>}
      </div>
      <button className="nickname-button" onClick={handleSubmit}>
        완료
      </button>
    </div>
  );
}
