import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import Swal from 'sweetalert2';
import '../../styles/ChangePassword.css';
import { useDrawerStore } from '../../stores/useDrawerStore';
import api from '../../config/axios'; // ✅ axios 인스턴스 사용

export default function ChangePassword() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [errorCurrent, setErrorCurrent] = useState('');
  const [errorNew, setErrorNew] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');

  const handleChangePassword = async () => {
    // ✅ 프론트 유효성 검사
    if (!currentPw) {
      setErrorCurrent('현재 비밀번호를 입력해주세요.');
      setErrorNew('');
      setErrorConfirm('');
      return;
    }
    if (!newPw || newPw.length < 8 || newPw.length > 20) {
      setErrorCurrent('');
      setErrorNew('8~20자의 새 비밀번호를 입력해주세요.');
      setErrorConfirm('');
      return;
    }
    if (!confirmPw) {
      setErrorCurrent('');
      setErrorNew('');
      setErrorConfirm('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (newPw !== confirmPw) {
      setErrorCurrent('');
      setErrorNew('');
      setErrorConfirm('비밀번호가 일치하지 않습니다.');
      return;
    }

    // ✅ 서버에 비밀번호 변경 요청
    try {
      await api.patch('/api/users/password', {
        currentPassword: currentPw,
        newPassword: newPw,
      });

      Swal.fire({
        icon: 'success',
        title: '비밀번호가 변경되었습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#ff9f4a',
      }).then(() => navigate('/main'));
    } catch (err) {
      console.error('비밀번호 변경 오류:', err);
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : '') ||
        '비밀번호 변경에 실패했습니다.';
      Swal.fire({
        icon: 'error',
        title: '변경 실패',
        text: msg,
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="pw-container">
      <div className="pw-header">
        <span
          className="pw-back"
          onClick={() => {
            setShouldAutoOpen(true);
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="pw-title">비밀번호 변경</span>
      </div>

      <div className="pw-body">
        <FiLock className="pw-icon" />
        <p className="pw-guide">비밀번호를 변경해주세요.</p>

        <div className="pw-input-wrapper">
          <p className="pw-hint">현재 비밀번호</p>
          <div className="pw-input-box">
            <FiLock className="pw-input-icon" />
            <input
              type="password"
              placeholder="사용 중인 비밀번호를 입력해주세요."
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
          </div>
          {errorCurrent && <p className="pw-error">{errorCurrent}</p>}

          <p className="pw-hint">새 비밀번호</p>
          <div className="pw-input-box">
            <FiLock className="pw-input-icon" />
            <input
              type="password"
              placeholder="문자, 숫자, 특수문자 포함 8~20자"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          {errorNew && <p className="pw-error">{errorNew}</p>}

          <p className="pw-hint">새 비밀번호 확인</p>
          <div className="pw-input-box">
            <FiLock className="pw-input-icon" />
            <input
              type="password"
              placeholder="새 비밀번호를 한 번 더 입력해주세요."
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </div>
          {errorConfirm && <p className="pw-error">{errorConfirm}</p>}

          <button className="pw-button" onClick={handleChangePassword}>
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
