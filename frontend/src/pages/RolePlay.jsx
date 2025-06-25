import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import Swal from 'sweetalert2';
import Character from '../assets/characters/login-character.png';
import '../styles/RolePlay.css';

const steps = [
  { id: 1, question: '상대방의 이름을 알려주세요.' },
  { id: 2, question: '상대방과의 관계를 알려주세요.' },
  { id: 3, question: '상대방의 말투는 어떤가요?' },
  { id: 4, question: '상대방의 성격은 어떤가요?' },
  { id: 5, question: '상대방과 어떤 상황이었나요?' },
];

function RolePlay() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(steps.length).fill(''));
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ 진입 시 역할 존재 여부 확인
  useEffect(() => {
    const checkCharacter = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        Swal.fire({
          title: '로그인이 필요합니다.',
          text: '로그인 후 다시 시도해 주세요.',
          icon: 'warning',
          confirmButtonColor: '#ffa158',
        }).then(() => navigate('/login'));
        return;
      }

      try {
        const res = await api.get(`/api/character/${userId}/exists`);
        if (res.data === true) {
          navigate('/roleplay/chat');
        }
      } catch (error) {
        console.error('역할 존재 여부 확인 실패:', error);
      }
    };

    checkCharacter();
  }, [navigate]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleNext = async () => {
    if (inputValue.trim() === '') return;

    const updated = [...answers];
    updated[step] = inputValue;
    setAnswers(updated);
    setInputValue('');

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          Swal.fire({
            title: '오류!',
            text: '로그인이 필요합니다.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
          navigate('/login');
          return;
        }

        const payload = {
          userId,
          name: updated[0],
          relationship: updated[1],
          tone: updated[2],
          personality: updated[3],
          situation: updated[4],
        };

        const res = await api.post('/api/character', payload);
        const characterId = res.data;

        Swal.fire({
          title: '역할 저장 완료!',
          text: '이제 역할극을 시작해볼까요?',
          icon: 'success',
          confirmButtonColor: '#ffa158',
        }).then(() => {
          setFadeOut(true);
          setTimeout(() => {
            navigate('/roleplay/chat', {
              state: { characterId, userId },
            });
          }, 300);
        });
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || '역할을 저장하지 못했습니다.';
        Swal.fire({
          title: '실패!',
          text: errorMsg,
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  return (
    <div className={`roleplay-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="roleplay-header">
        <span
          className="back-button"
          onClick={() => {
            if (step > 0) {
              setStep(step - 1);
              setInputValue(answers[step - 1] || '');
            } else {
              navigate(-1);
            }
          }}
        >
          ←
        </span>
        <span className="roleplay-title">Milo.</span>
        <span className="header-space" />
      </div>

      <div className="roleplay-body">
        {step === 0 && <p className="greeting">안녕하굴! 👋</p>}
        <img src={Character} alt="milo 캐릭터" className="roleplay-character" />

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-step">
          {step + 1}/{steps.length}
        </div>

        <p className="prompt-text">{steps[step].question}</p>

        <textarea
          className="target-input"
          value={inputValue}
          onChange={handleChange}
          placeholder="입력해 주세요"
          rows={1}
          ref={inputRef}
        />

        {answers[step] && (
          <p className="previous-answer">이전 입력: {answers[step]}</p>
        )}

        <button className="next-button" onClick={handleNext}>
          {step === steps.length - 1 ? '작성 완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

export default RolePlay;
