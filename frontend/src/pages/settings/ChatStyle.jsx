import { useState, useEffect } from 'react';
import '../../styles/ChangeStyle.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useDrawerStore } from '../../stores/useDrawerStore';
import Swal from 'sweetalert2';
import api from '../../config/axios';

export default function ChangeStyle() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  // ✅ 대화 스타일 조회
  useEffect(() => {
    const fetchUserPrompt = async () => {
      try {
        const res = await api.get('/api/prompt');
        console.log('응답:', res.data);

        if (typeof res.data === 'string') {
          setSelected(res.data === 'emotional' ? '공감형' : '조언형');
        }
      } catch (err) {
        console.error('스타일 조회 실패:', err);
      }
    };

    fetchUserPrompt();
  }, []);

  // ✅ 대화 스타일 저장
  const handleSaveStyle = async () => {
    const promptValue = selected === '공감형' ? 0 : 1;

    try {
      await api.put('/api/prompt', {
        emotionPrompt: promptValue,
      });

      Swal.fire({
        icon: 'success',
        title: '스타일이 저장되었어요!',
        confirmButtonText: '확인',
        confirmButtonColor: '#ff9f4a',
      }).then(() => {
        navigate('/main');
      });
    } catch (err) {
      console.error('스타일 저장 실패:', err);
      Swal.fire({
        icon: 'error',
        title: '저장 실패',
        text: '다시 시도해주세요.',
      });
    }
  };

  const styles = [
    {
      type: '공감형',
      description:
        '당신의 감정을 있는 그대로 받아들이며, 위로와 공감을 아낌없이 표현해요.',
    },
    {
      type: '조언형',
      description:
        '목표를 명확히 설정하도록 돕고, 변화할 수 있도록 조언하고 힘을 실어줘요.',
    },
  ];

  return (
    <div className="style-container">
      <div className="style-header">
        <span
          className="style-back"
          onClick={() => {
            setShouldAutoOpen(true); // 플래그 설정
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="style-title">스타일 변경</span>
      </div>

      <div className="style-list">
        {styles.map(({ type, description }) => (
          <div
            key={type}
            className={`style-card ${selected === type ? 'selected' : ''}`}
            onClick={() => setSelected(type)}
          >
            <div className="style-label">
              <span className="style-label-type">{type}</span>
            </div>
            <p className="style-description">{description}</p>
            {selected === type && <FaCheckCircle className="check-icon" />}
          </div>
        ))}
      </div>

      <button
        className="style-save-button"
        onClick={handleSaveStyle}
        disabled={!selected} // 선택 안 하면 비활성화
      >
        저장하기
      </button>
    </div>
  );
}
