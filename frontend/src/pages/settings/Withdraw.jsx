import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Withdraw.css';
import Character from '../../assets/characters/crying-character.png';
import Flower from '../../assets/icons/flower.png';
import { FiLock } from 'react-icons/fi';
import { useDrawerStore } from '../../stores/useDrawerStore';
import api from '../../config/axios'; // ✅ axios 인스턴스

export default function Withdraw() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);

  // ✅ 실제 탈퇴 요청 처리
  const requestWithdraw = async () => {
    try {
      await api.delete('/api/users/delete', {
        data: { password: password }, // ✅ body에 비밀번호 전달
      });

      Swal.fire({
        icon: 'success',
        title: '탈퇴 완료',
        text: '그동안 함께해주셔서 감사합니다.',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
      });

      localStorage.removeItem('token'); // ✅ 토큰 제거
      setStep(2); // 완료 페이지 전환
    } catch (err) {
      console.error(err);
      setError(true);

      Swal.fire({
        icon: 'error',
        title: '탈퇴 실패',
        text:
          err.response?.data ||
          '비밀번호가 일치하지 않거나 서버 오류가 발생했습니다.',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  // ✅ 탈퇴 버튼 클릭 시 확인 모달 → 실제 탈퇴 요청
  const handleWithdraw = () => {
    if (!password) {
      setError(true);
      return;
    }

    Swal.fire({
      title: '정말 탈퇴하시겠어요?',
      imageUrl: Character,
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니요',
      customClass: {
        popup: 'popup',
        title: 'popup-title',
        image: 'popup-image',
        actions: 'popup-actions',
        confirmButton: 'popup-yes-button',
        cancelButton: 'popup-no-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        requestWithdraw();
      }
    });
  };

  return (
    <div className="withdraw-container">
      {/* STEP 1: 비밀번호 입력 */}
      {step === 1 && (
        <div>
          <div className="withdraw-header">
            <span
              className="back-button"
              onClick={() => {
                setShouldAutoOpen(true);
                navigate('/main');
              }}
            >
              ←
            </span>
            <span className="withdraw-title">회원탈퇴</span>
          </div>

          <div className="withdraw-wraper">
            <h2 className="withdraw-check">비밀번호를 확인합니다.</h2>
            <div className="withdraw-input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? '' : '현재 비밀번호를 입력해주세요.'}
                className="withdraw-input"
              />
              <FiLock className="withdraw-input-icon" />
            </div>

            {error && (
              <p className="withdraw-error">비밀번호를 다시 확인해주세요.</p>
            )}

            <button className="withdraw-button" onClick={handleWithdraw}>
              탈퇴하기
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 탈퇴 완료 화면 */}
      {step === 2 && (
        <div className="withdraw-success">
          <img src={Character} alt="탈퇴완료" className="success-image" />
          <p className="success-text">회원탈퇴가 완료되었습니다.</p>
          <button
            className="withdraw-button"
            onClick={() => navigate('/login')}
          >
            확인
          </button>
          <div className="footer">
            <img src={Flower} alt="flower" />
            <p className="footer-text">
              우리의 기록은 여기까지지만,
              <br />
              당신의 행복은 계속되기를 바라요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
